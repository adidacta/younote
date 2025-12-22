import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | YouNote",
  description: "Privacy Policy for YouNote - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">
          <strong>Last Updated:</strong> December 22, 2024
        </p>

        <p>
          This Privacy Policy describes how YouNote ("we," "us," or "our") collects, uses, and protects
          your personal information when you use our Service. By using YouNote, you agree to the collection
          and use of information in accordance with this policy.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide</h3>
        <p>
          When you create an account and use YouNote, we collect:
        </p>
        <ul>
          <li><strong>Account Information:</strong> Email address, password (encrypted), and optional profile information</li>
          <li><strong>User Content:</strong> Notebooks, pages, notes, and any other content you create through the Service</li>
          <li><strong>Communication Data:</strong> Messages you send to us for support or inquiries</li>
        </ul>

        <h3>1.2 Automatically Collected Information</h3>
        <p>
          When you access the Service, we automatically collect:
        </p>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, features used, timestamps, and interaction patterns</li>
          <li><strong>Device Information:</strong> Browser type, operating system, device type, IP address</li>
          <li><strong>Analytics Data:</strong> We use Google Analytics to understand how users interact with the Service</li>
          <li><strong>Session Data:</strong> We may use session recording tools to improve user experience and identify technical issues</li>
        </ul>

        <h3>1.3 YouTube Integration</h3>
        <p>
          When you add YouTube videos to your pages, we collect:
        </p>
        <ul>
          <li>YouTube video IDs and URLs</li>
          <li>Video metadata (title, thumbnail, duration, channel name) via YouTube API</li>
          <li>Video transcripts when available</li>
        </ul>
        <p>
          Your use of YouTube content through the Service is subject to YouTube's Privacy Policy and Terms of Service.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the collected information for the following purposes:
        </p>
        <ul>
          <li><strong>Provide the Service:</strong> To operate, maintain, and improve YouNote's features and functionality</li>
          <li><strong>Account Management:</strong> To create and manage your account, authenticate you, and provide customer support</li>
          <li><strong>Communication:</strong> To send you transactional emails (password resets, account notifications) and, if you opt in, marketing communications</li>
          <li><strong>Analytics:</strong> To understand usage patterns, improve user experience, and develop new features</li>
          <li><strong>Security:</strong> To detect, prevent, and address technical issues, abuse, and security threats</li>
          <li><strong>Compliance:</strong> To comply with legal obligations and enforce our Terms of Use</li>
        </ul>

        <h3>2.1 Your Content is Private</h3>
        <p>
          <strong>We will never use, analyze, sell, or share your User Content (notebooks, pages, notes) for any purpose
          other than providing the Service to you.</strong> Your notes are private and belong to you. We do not use your
          content for marketing, training AI models, or any other purpose.
        </p>

        <h2>3. How We Share Your Information</h2>

        <h3>3.1 We Do Not Sell Your Data</h3>
        <p>
          We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
        </p>

        <h3>3.2 Third-Party Service Providers</h3>
        <p>
          We share information with trusted third-party service providers who assist us in operating the Service:
        </p>
        <ul>
          <li><strong>Supabase:</strong> Database hosting and user authentication</li>
          <li><strong>Vercel:</strong> Application hosting and deployment</li>
          <li><strong>Email Service Providers:</strong> For sending transactional and marketing emails</li>
          <li><strong>Google Analytics:</strong> For usage analytics and insights</li>
          <li><strong>Session Recording Services:</strong> For user experience analysis and troubleshooting</li>
          <li><strong>YouTube API:</strong> For fetching video metadata and transcripts</li>
        </ul>
        <p>
          These service providers have access to your information only to perform specific tasks on our behalf and are
          obligated to protect your data and not use it for other purposes.
        </p>

        <h3>3.3 Shared Pages</h3>
        <p>
          When you use the sharing feature to share a page, anyone with the share link can view that page's content.
          Shared pages are view-only and do not expose your account information.
        </p>

        <h3>3.4 Legal Requirements</h3>
        <p>
          We may disclose your information if required by law, subpoena, court order, or other legal process, or if we
          believe in good faith that disclosure is necessary to:
        </p>
        <ul>
          <li>Comply with legal obligations</li>
          <li>Protect our rights, property, or safety, or that of our users or the public</li>
          <li>Detect, prevent, or address fraud, security, or technical issues</li>
          <li>Enforce our Terms of Use</li>
        </ul>

        <h2>4. Data Retention</h2>

        <h3>4.1 Active Accounts</h3>
        <p>
          We retain your account information and User Content for as long as your account is active.
        </p>

        <h3>4.2 Account Deletion</h3>
        <p>
          When you delete your account:
        </p>
        <ul>
          <li>Your User Content (notebooks, pages, notes) will be permanently deleted within <strong>30 days</strong></li>
          <li>We retain account information for up to 30 days to allow for account recovery in case of accidental deletion</li>
          <li>After 30 days, all your data is permanently deleted from our systems</li>
          <li>Some information may be retained in backups for up to 90 days, after which it is permanently deleted</li>
        </ul>

        <h3>4.3 Legal Obligations</h3>
        <p>
          We may retain certain information for longer periods if required by law or to resolve disputes.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information from unauthorized access, alteration,
          disclosure, or destruction. These measures include:
        </p>
        <ul>
          <li>Encryption of data in transit (HTTPS/TLS)</li>
          <li>Encryption of passwords using industry-standard hashing</li>
          <li>Secure database access controls</li>
          <li>Regular security updates and monitoring</li>
        </ul>
        <p>
          However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive
          to protect your information, we cannot guarantee absolute security.
        </p>

        <h2>6. Cookies and Tracking Technologies</h2>

        <h3>6.1 What Are Cookies?</h3>
        <p>
          Cookies are small text files stored on your device that help us provide and improve the Service.
        </p>

        <h3>6.2 How We Use Cookies</h3>
        <p>
          We use cookies and similar tracking technologies for:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic functionality</li>
          <li><strong>Analytics Cookies:</strong> To understand how you use the Service (via Google Analytics)</li>
          <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
          <li><strong>Session Recording:</strong> To analyze user interactions and improve the Service</li>
        </ul>

        <h3>6.3 Your Cookie Choices</h3>
        <p>
          You can control cookies through your browser settings. Note that disabling cookies may affect the
          functionality of the Service. Essential cookies required for authentication cannot be disabled.
        </p>

        <h2>7. Your Rights and Choices</h2>

        <h3>7.1 Access and Update</h3>
        <p>
          You can access and update your account information and User Content at any time through the Service.
        </p>

        <h3>7.2 Account Deletion</h3>
        <p>
          You can delete your account by contacting us at{" "}
          <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>. Upon deletion, your data will be removed
          in accordance with our data retention policy.
        </p>

        <h3>7.3 Email Communications</h3>
        <p>
          You can opt out of marketing emails by clicking the "unsubscribe" link in any marketing email.
          You cannot opt out of essential transactional emails (password resets, security alerts).
        </p>

        <h3>7.4 Do Not Track</h3>
        <p>
          We currently do not respond to Do Not Track (DNT) browser signals. However, you can manage tracking
          through your browser settings and cookie preferences.
        </p>

        <h2>8. International Users and Data Transfers</h2>
        <p>
          YouNote is operated from Israel. If you access the Service from outside Israel, your information may be
          transferred to, stored, and processed in Israel or other countries where our service providers operate.
        </p>
        <p>
          By using the Service, you consent to the transfer of your information to Israel and other countries that
          may have different data protection laws than your country of residence.
        </p>

        <h2>9. GDPR Rights (European Users)</h2>
        <p>
          If you are located in the European Economic Area (EEA), you have certain rights under the General Data
          Protection Regulation (GDPR):
        </p>
        <ul>
          <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
          <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
          <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
          <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>.
        </p>
        <p>
          <strong>Legal Basis for Processing:</strong> We process your data based on:
        </p>
        <ul>
          <li>Your consent (for marketing communications, analytics)</li>
          <li>Performance of a contract (to provide the Service)</li>
          <li>Legitimate interests (to improve the Service, prevent abuse)</li>
          <li>Legal obligations (to comply with applicable laws)</li>
        </ul>

        <h2>10. CCPA Rights (California Residents)</h2>
        <p>
          If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
        </p>
        <ul>
          <li><strong>Right to Know:</strong> Request disclosure of personal information we collect, use, and share</li>
          <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
          <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (note: we do not sell personal information)</li>
          <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>.
        </p>
        <p>
          We do not sell your personal information to third parties.
        </p>

        <h2>11. Children's Privacy</h2>
        <p>
          The Service is available to users aged 13 and older. We do not knowingly collect personal information from
          children under 13. If you are a parent or guardian and believe your child under 13 has provided us with
          personal information, please contact us at{" "}
          <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>, and we will delete such information.
        </p>
        <p>
          If you are between 13 and 18, you represent that you have your parent or guardian's permission to use the Service.
        </p>

        <h2>12. Third-Party Links</h2>
        <p>
          The Service may contain links to third-party websites, including YouTube. We are not responsible for the
          privacy practices or content of these third-party sites. We encourage you to review the privacy policies
          of any third-party sites you visit.
        </p>

        <h2>13. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we will notify you by:
        </p>
        <ul>
          <li>Posting the updated policy on this page</li>
          <li>Updating the "Last Updated" date</li>
          <li>Sending an email notification (for significant changes)</li>
        </ul>
        <p>
          Your continued use of the Service after changes to this Privacy Policy constitutes acceptance of the
          updated policy. We encourage you to review this Privacy Policy periodically.
        </p>

        <h2>14. Contact Us</h2>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
          please contact us:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>
          <br />
          <strong>Privacy Inquiries:</strong> Please include "Privacy" in the subject line
        </p>

        <h2>15. Data Protection Officer</h2>
        <p>
          For GDPR-related inquiries, you may contact our Data Protection Officer at{" "}
          <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>.
        </p>

        <h2>16. Your Consent</h2>
        <p>
          By using YouNote, you consent to the collection, use, and sharing of your information as described in
          this Privacy Policy.
        </p>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          This Privacy Policy is effective as of the "Last Updated" date above. Thank you for trusting YouNote
          with your data.
        </p>
      </div>
    </div>
  );
}
