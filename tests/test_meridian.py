"""Direct tests for MERIDIAN. AI confirm path verified live via seed."""
from pathlib import Path

CONTRACT = str(Path(__file__).resolve().parents[1] / "contracts" / "meridian.py")
PENDING = 0; CONFIRMED = 1; REFUTED = 2


def _rec(m, vm, who, label="Eiffel Tower", lat="48.8584", lng="2.2945",
         claim="A wrought-iron tower located in Paris.", url="https://example.com"):
    vm.sender = who
    return m.record_observation(label, lat, lng, claim, url)


def test_record(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    oid = _rec(m, direct_vm, direct_alice)
    assert oid == 0
    o = m.get_observation(0)
    assert o["status"] == PENDING
    assert o["lat"] == "48.8584"
    assert o["archived"] == 0


def test_requires_label(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("a label is required"):
        m.record_observation("", "1.0", "2.0", "c", "https://x.com")


def test_requires_claim(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("a claim is required"):
        m.record_observation("L", "1.0", "2.0", "  ", "https://x.com")


def test_non_http(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("must be http"):
        m.record_observation("L", "1.0", "2.0", "c", "ftp://x")


def test_bad_coords(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("must be numbers"):
        m.record_observation("L", "north", "west", "c", "https://x.com")


def test_negative_coords_ok(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    _rec(m, direct_vm, direct_alice, label="Statue of Liberty", lat="40.6892", lng="-74.0445")
    assert m.get_observation(0)["lng"] == "-74.0445"


def test_owner_archive(deploy, direct_vm):
    m = deploy(CONTRACT)
    m.record_observation("L", "1.0", "2.0", "c", "https://x.com")
    m.archive_observation(0)
    assert m.get_observation(0)["archived"] == 1
    assert m.get_stats()["total"] == 0


def test_unauthorized_archive(deploy, direct_vm, direct_alice, direct_bob):
    m = deploy(CONTRACT)
    owner = m.get_owner()
    non = direct_bob if str(direct_alice).lower() == str(owner).lower() else direct_alice
    direct_vm.sender = non
    with direct_vm.expect_revert("only the owner can archive"):
        m.archive_observation(0)


def test_stats_and_count(deploy, direct_vm, direct_alice):
    m = deploy(CONTRACT)
    _rec(m, direct_vm, direct_alice, label="A")
    _rec(m, direct_vm, direct_alice, label="B")
    assert m.get_observation_count() == 2
    assert m.get_stats()["pending"] == 2
