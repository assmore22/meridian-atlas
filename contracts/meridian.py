# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
MERIDIAN - Geospatial Observations, Verified by Consensus
=========================================================
A field atlas of located claims. Anyone records an observation: a labelled place
with coordinates, a claim about it, and a public source. To settle it, the
contract reads the source and a validator set decides (Equivalence Principle)
whether the source confirms the claim for that place.

Status: PENDING(0) -> CONFIRMED(1) | REFUTED(2)
"""

from genlayer import *
from dataclasses import dataclass
import json
import typing

PENDING = 0
CONFIRMED = 1
REFUTED = 2


@allow_storage
@dataclass
class Observation:
    observer: Address
    label: str
    lat: str
    lng: str
    claim: str
    source_url: str
    status: u8
    rationale: str
    archived: u8


class Meridian(gl.Contract):
    owner: Address
    observations: DynArray[Observation]

    def __init__(self) -> None:
        self.owner = gl.message.sender_address

    @gl.public.write
    def record_observation(self, label: str, lat: str, lng: str, claim: str, source_url: str) -> int:
        if len(label.strip()) == 0:
            raise gl.vm.UserError("a label is required")
        if len(claim.strip()) == 0:
            raise gl.vm.UserError("a claim is required")
        if len(source_url.strip()) == 0:
            raise gl.vm.UserError("a source URL is required")
        if not (source_url.startswith("http://") or source_url.startswith("https://")):
            raise gl.vm.UserError("source URL must be http(s)")
        if not self._is_num(lat) or not self._is_num(lng):
            raise gl.vm.UserError("latitude and longitude must be numbers")
        o = self.observations.append_new_get()
        o.observer = gl.message.sender_address
        o.label = label
        o.lat = lat
        o.lng = lng
        o.claim = claim
        o.source_url = source_url
        o.status = u8(PENDING)
        o.rationale = ""
        o.archived = u8(0)
        return len(self.observations) - 1

    @gl.public.write
    def confirm_observation(self, observation_id: int) -> None:
        o = self._get(observation_id)
        if o.status != PENDING:
            raise gl.vm.UserError("this observation is already settled")
        if o.archived != 0:
            raise gl.vm.UserError("this observation is archived")

        label = o.label
        lat = o.lat
        lng = o.lng
        claim = o.claim
        url = o.source_url

        def leader_fn() -> str:
            page = ""
            try:
                page = gl.nondet.web.get(url).body.decode("utf-8")[:6000]
            except Exception:
                page = ""
            if len(page.strip()) == 0:
                return json.dumps({"confirmed": False, "reason": "The source could not be read."})
            prompt = (
                f"A geospatial observation was recorded.\n"
                f"Place: {label}\nCoordinates: {lat}, {lng}\n"
                f"Claim about this place: {claim}\n\n"
                f"Source document:\n{page}\n\n"
                "Based strictly on the source, does it CONFIRM the claim for this "
                'place? Reply with ONLY JSON: {"confirmed": true} or '
                '{"confirmed": false}, plus a short "reason".'
            )
            return gl.nondet.exec_prompt(prompt)

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            return self._decision_of(leader_res.calldata)[0] == self._decision_of(leader_fn())[0]

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        ok, reason = self._decision_of(result)
        o.rationale = reason[:300]
        o.status = u8(CONFIRMED) if ok else u8(REFUTED)

    @gl.public.write
    def archive_observation(self, observation_id: int) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("only the owner can archive")
        o = self._get(observation_id)
        o.archived = u8(1)

    @gl.public.view
    def get_owner(self) -> str:
        return self.owner.as_hex

    @gl.public.view
    def get_observation_count(self) -> int:
        return len(self.observations)

    @gl.public.view
    def get_stats(self) -> dict:
        c = 0
        r = 0
        p = 0
        for o in self.observations:
            if o.archived != 0:
                continue
            if o.status == CONFIRMED:
                c += 1
            elif o.status == REFUTED:
                r += 1
            else:
                p += 1
        return {"total": c + r + p, "confirmed": c, "refuted": r, "pending": p}

    @gl.public.view
    def get_observation(self, observation_id: int) -> dict:
        o = self._get(observation_id)
        return {
            "observer": o.observer.as_hex,
            "label": o.label,
            "lat": o.lat,
            "lng": o.lng,
            "claim": o.claim,
            "source_url": o.source_url,
            "status": int(o.status),
            "rationale": o.rationale,
            "archived": int(o.archived),
        }

    def _get(self, observation_id: int) -> Observation:
        if observation_id < 0 or observation_id >= len(self.observations):
            raise gl.vm.UserError("no such observation")
        return self.observations[observation_id]

    def _is_num(self, s: str) -> bool:
        try:
            float(s)
            return True
        except (ValueError, TypeError):
            return False

    def _decision_of(self, result: typing.Any) -> tuple:
        data = result
        if isinstance(data, str):
            data = self._extract_json(data)
        if not isinstance(data, dict):
            return (False, "")
        raw = data.get("confirmed", None)
        reason = str(data.get("reason", ""))
        if isinstance(raw, bool):
            return (raw, reason)
        if isinstance(raw, str):
            return (raw.strip().lower() == "true", reason)
        return (False, reason)

    def _extract_json(self, text: str) -> typing.Any:
        try:
            return json.loads(text)
        except (ValueError, TypeError):
            pass
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except (ValueError, TypeError):
                return None
        return None
