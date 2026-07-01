import Link from "next/link";
export const metadata = { title: "Method - Meridian Atlas" };
export default function MethodPage() {
  const steps = [
    ["01 Record", "A place, its coordinates, a claim about it, and a public source are stored on-chain."],
    ["02 Read", "On confirmation the contract fetches the cited source. Reading is nondeterministic, so it runs in GenLayer's equivalence flow."],
    ["03 Agree", "Each validator independently reads the same source and decides confirmed or refuted; the result is recorded only on agreement."],
    ["04 Fix", "Confirmed observations are pinned to the atlas; refuted ones are marked. The raw page is never stored."],
    ["05 Undetermined", "If the source can't be read or validators disagree, the observation stays unconfirmed rather than guessing."],
  ];
  return (
    <div className="mx-auto max-w-reading px-4 py-10 sm:px-5 md:px-8">
      <span className="label">Method</span>
      <h1 className="mt-2 font-head text-fluid-section font-bold">How an observation is confirmed.</h1>
      <p className="mt-3 text-ink/80">Meridian is a thin atlas over a GenLayer Intelligent Contract. Confirming a located claim needs reading a source and protecting that judgement from any single party.</p>
      <div className="mt-6">
        {steps.map(([h, b]) => (
          <section key={h} className="hair border-x-0 border-b-0 py-5">
            <h2 className="font-head text-fluid-panel font-bold">{h}</h2>
            <p className="mt-1 max-w-reading text-ink/80">{b}</p>
          </section>
        ))}
      </div>
      <Link href="/" className="mt-8 inline-flex min-h-[48px] items-center bg-meridian px-6 text-sm font-semibold text-white">Open the atlas</Link>
    </div>
  );
}
