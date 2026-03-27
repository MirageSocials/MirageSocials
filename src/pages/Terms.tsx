import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold font-mono">Terms of Service</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <p className="text-sm text-muted-foreground">Last updated: March 27, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using xitter ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 18 years old and capable of forming a binding contract to use the Platform. By using xitter, you represent and warrant that you meet these requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. User Content</h2>
          <p className="text-muted-foreground leading-relaxed">
            You retain ownership of content you post. By posting, you grant xitter a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Marketplace & Transactions</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Platform facilitates transactions using Solana blockchain. All transactions are final and non-refundable. You are solely responsible for your trading and purchasing decisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Prohibited Conduct</h2>
          <p className="text-muted-foreground leading-relaxed">
            You may not use the Platform to engage in illegal activity, harassment, spam, market manipulation, or any conduct that violates applicable laws or regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy of any information or the outcome of any transactions conducted on the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, xitter shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl font-bold">10. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:support@xitter.app" className="text-primary hover:underline">support@xitter.app</a>.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Terms;
