"""Seed MERIDIAN with real geospatial observations on studionet (AI confirm)."""
from pathlib import Path
from gltest_cli.config.general import get_general_config
from gltest_cli.config.user import load_user_config
from gltest import get_contract_factory, get_default_account

ROOT = Path(__file__).resolve().parents[1]
ADDR = "0x9Ac79368d4A5CC4f4F4B0204e03D2dAEbbaC2165"
W = "https://en.wikipedia.org/api/rest_v1/page/summary/"

cfg = load_user_config(str(ROOT / "gltest.config.yaml"))
get_general_config().user_config = cfg
factory = get_contract_factory(contract_file_path=str(ROOT / "contracts" / "meridian.py"))
c = factory.build_contract(ADDR, account=get_default_account())

OBS = [
    ("Eiffel Tower", "48.8584", "2.2945", "A wrought-iron lattice tower located in Paris, France.", W + "Eiffel_Tower", True),
    ("Statue of Liberty", "40.6892", "-74.0445", "A neoclassical copper statue on Liberty Island in New York Harbor.", W + "Statue_of_Liberty", True),
    ("Atlantis", "31.0", "-24.0", "A confirmed, discovered underwater city at these coordinates.", W + "Atlantis", True),
    ("Mount Fuji", "35.3606", "138.7274", "An active stratovolcano and the highest mountain in Japan.", W + "Mount_Fuji", False),
]


def main():
    if c.get_observation_count().call() == 0:
        for (l, la, ln, cl, u, _) in OBS:
            c.record_observation(args=[l, la, ln, cl, u]).transact()
            print("recorded:", l)
    for i in range(c.get_observation_count().call()):
        do = OBS[i][5] if i < len(OBS) else False
        o = c.get_observation(args=[i]).call()
        if do and int(o["status"]) == 0:
            print("confirming (AI):", o["label"])
            try:
                c.confirm_observation(args=[i]).transact()
            except Exception as e:
                print("  ->", e)
    print("stats:", c.get_stats().call())
    for i in range(c.get_observation_count().call()):
        o = c.get_observation(args=[i]).call()
        print(i, ["PENDING", "CONFIRMED", "REFUTED"][int(o["status"])], o["label"], "|", (o["rationale"] or "")[:44])


if __name__ == "__main__":
    main()
