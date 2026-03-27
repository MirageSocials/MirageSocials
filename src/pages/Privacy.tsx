import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold font-mono">Privacy Policy</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <p className="text-sm text-muted-foreground">Last updated: March 27, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly, such as your email address, username, wallet address, and profile details. We also collect usage data including interactions, posts, and transaction history.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use your information to operate the Platform, process transactions, personalize your experience, communicate with you, and improve our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Blockchain Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            Transactions conducted on the Solana blockchain are publicly visible. We cannot delete or modify blockchain data. Your wallet address and transaction history are inherently public.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell your personal information. We may share data with service providers who assist in operating the Platform, or when required by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Cookies & Analytics</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may use cookies and similar technologies to collect usage information and improve the Platform. You can control cookie settings through your browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You may request access to, correction of, or deletion of your personal data by contacting us. Note that some data stored on the blockchain cannot be modified or deleted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform.
          </p>
        </section>

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl font-bold">9. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy or your personal data, please contact us at{" "}
            <a href="mailto:support@mirage.app" className="text-primary hover:underline">support@mirage.app</a>.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
