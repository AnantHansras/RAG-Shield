import { MessageSquare, Bug, BarChart3 } from "lucide-react";
import FeatureCard from "../components/FeatureCard.jsx";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-[1040px] px-7">
        <div className="pb-14 pt-24 text-left">
          <h1 className="text-[40px] font-semibold tracking-tight text-ink">RAG-Shield</h1>
          <p className="mt-2.5 text-[17px] font-medium text-accent-ink">
            RAG Poisoning Defense Framework
          </p>
          <p className="mt-4 max-w-[560px] text-base text-ink-soft">
            Evaluate RAG systems and study their resilience against poisoning attacks.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 pb-24 max-[860px]:grid-cols-1">
          <FeatureCard
            to="/chatbot"
            icon={<MessageSquare size={17} />}
            title="Chatbot"
            description="Compare different RAG systems with and without defenses."
          />
          <FeatureCard
            to="/attack"
            icon={<Bug size={17} />}
            title="Attack"
            description="Simulate a RAG poisoning attack and observe its effect on retrieval."
          />
          <FeatureCard
            to="/system-evaluation"
            icon={<BarChart3 size={17} />}
            title="System Evaluation"
            description="Run a batch of queries and measure overall system performance."
          />
        </div>
      </div>
    </div>
  );
}
