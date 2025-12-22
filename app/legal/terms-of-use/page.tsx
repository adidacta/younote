import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | YouNote",
  description: "Terms of Use for YouNote - Timestamped note-taking for YouTube videos",
};

export default function TermsOfUsePage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h1>Terms of Use</h1>
        <p className="text-muted-foreground">
          <strong>Last Updated:</strong> December 22, 2024
        </p>

        <p>
          Welcome to YouNote. These Terms of Use ("Terms") govern your access to and use of the YouNote
          application and services (collectively, the "Service"). By accessing or using the Service, you
          agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
        </p>

        <h2>1. About YouNote</h2>
        <p>
          YouNote is a web application that enables users to take timestamped notes while watching YouTube
          videos. The Service is operated by Adi Dacta ("we," "us," or "our"), an individual based in Israel.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old to use the Service. By using the Service, you represent and
          warrant that you meet this age requirement. If you are under 18, you represent that you have
          your parent or guardian's permission to use the Service.
        </p>

        <h2>3. User Accounts</h2>
        <h3>3.1 Account Creation</h3>
        <p>
          To use certain features of the Service, you must create an account. You agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
          <li>Accept responsibility for all activities that occur under your account</li>
        </ul>

        <h3>3.2 Account Security</h3>
        <p>
          You are responsible for maintaining the security of your account credentials. We are not liable
          for any loss or damage arising from your failure to maintain account security.
        </p>

        <h2>4. User Content and Ownership</h2>
        <h3>4.1 Your Content</h3>
        <p>
          You retain full ownership of all content you create through the Service, including but not limited
          to notebooks, pages, and notes (collectively, "User Content"). We do not claim any ownership rights
          to your User Content.
        </p>

        <h3>4.2 License to Operate the Service</h3>
        <p>
          By creating User Content, you grant us a limited, non-exclusive, royalty-free license to store,
          display, and transmit your User Content solely for the purpose of operating and providing the
          Service to you. This license exists only to enable us to provide the Service and ends when you
          delete your content or account.
        </p>

        <h3>4.3 Our Commitment</h3>
        <p>
          We will never use, analyze, sell, or share your User Content for any purpose other than providing
          the Service to you. Your notes are private and belong to you.
        </p>

        <h3>4.4 Shared Content</h3>
        <p>
          When you share a page using the sharing feature, you grant view-only access to anyone with the
          share link. You can revoke this access at any time by regenerating or deleting the share link.
        </p>

        <h2>5. Acceptable Use</h2>
        <h3>5.1 Prohibited Conduct</h3>
        <p>
          You agree not to:
        </p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the intellectual property rights of others</li>
          <li>Upload, post, or transmit any harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable content</li>
          <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity</li>
          <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
          <li>Attempt to gain unauthorized access to any portion of the Service, other accounts, or any systems or networks</li>
          <li>Use the Service for any illegal purpose or to solicit others to perform illegal activities</li>
          <li>Transmit any viruses, malware, or other malicious code</li>
          <li>Harvest or collect information about users without their consent</li>
          <li>Use automated systems (bots, scrapers) to access the Service without our written permission</li>
          <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
          <li>Engage in any other conduct that we determine, in our sole discretion, constitutes misuse or misconduct</li>
        </ul>

        <h3>5.2 YouTube Terms Compliance</h3>
        <p>
          You acknowledge that the Service integrates with YouTube. Your use of YouTube videos through the
          Service is subject to YouTube's Terms of Service. You agree to comply with YouTube's Terms of
          Service when using the Service.
        </p>

        <h2>6. Account Termination</h2>
        <h3>6.1 Termination by You</h3>
        <p>
          You may terminate your account at any time by contacting us at{" "}
          <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>. Upon termination, your User Content
          will be deleted in accordance with our Privacy Policy.
        </p>

        <h3>6.2 Termination by Us</h3>
        <p>
          We reserve the right to suspend or terminate your account and access to the Service at any time,
          for any reason, including but not limited to:
        </p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Misuse of the Service</li>
          <li>Misconduct of any sort</li>
          <li>Any reason we determine, in our sole discretion, warrants termination</li>
        </ul>
        <p>
          We may terminate accounts without prior notice. We are not obligated to provide reasons for
          account termination.
        </p>

        <h2>7. Intellectual Property</h2>
        <h3>7.1 Service Ownership</h3>
        <p>
          The Service, including its design, code, features, and functionality, is owned by us and is
          protected by copyright, trademark, and other intellectual property laws. You may not copy,
          modify, distribute, sell, or lease any part of the Service without our written permission.
        </p>

        <h3>7.2 Trademarks</h3>
        <p>
          "YouNote" and related logos are our trademarks. You may not use these trademarks without our
          prior written permission.
        </p>

        <h2>8. Third-Party Services</h2>
        <p>
          The Service integrates with third-party services, including but not limited to YouTube, Supabase,
          and Vercel. Your use of these third-party services is subject to their respective terms of service
          and privacy policies. We are not responsible for the practices or content of third-party services.
        </p>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
          OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that:
        </p>
        <ul>
          <li>The Service will be uninterrupted, secure, or error-free</li>
          <li>The results obtained from the Service will be accurate or reliable</li>
          <li>Any errors in the Service will be corrected</li>
          <li>The Service will meet your requirements</li>
        </ul>

        <h2>10. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
          DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING
          FROM:
        </p>
        <ul>
          <li>Your use or inability to use the Service</li>
          <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
          <li>Any interruption or cessation of transmission to or from the Service</li>
          <li>Any bugs, viruses, or other harmful code that may be transmitted through the Service</li>
          <li>Any errors or omissions in any content or for any loss or damage incurred as a result of your use of any content</li>
        </ul>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless YouNote, its operator, and affiliates from and
          against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees,
          arising out of or in any way connected with:
        </p>
        <ul>
          <li>Your access to or use of the Service</li>
          <li>Your User Content</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another party</li>
        </ul>

        <h2>12. Pricing and Payment</h2>
        <h3>12.1 Current Pricing</h3>
        <p>
          The Service is currently free to use. We reserve the right to introduce paid features, subscriptions,
          or pricing plans in the future.
        </p>

        <h3>12.2 Future Changes</h3>
        <p>
          If we introduce paid features, we will provide advance notice and update these Terms. Your continued
          use of paid features will constitute acceptance of the updated pricing terms.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. If we make material changes, we will notify
          you by email or through a prominent notice on the Service. Your continued use of the Service after
          such modifications constitutes your acceptance of the updated Terms.
        </p>
        <p>
          We encourage you to review these Terms periodically. The "Last Updated" date at the top of this page
          indicates when these Terms were last revised.
        </p>

        <h2>14. Governing Law and Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Israel,
          without regard to its conflict of law provisions. Any disputes arising from or relating to these
          Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Israel.
        </p>

        <h2>15. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
          limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in
          full force and effect.
        </p>

        <h2>16. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and us
          regarding the Service and supersede all prior agreements and understandings.
        </p>

        <h2>17. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:adi@adidacta.com">adi@adidacta.com</a>
        </p>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          By using YouNote, you acknowledge that you have read, understood, and agree to be bound by these
          Terms of Use.
        </p>
      </div>
    </div>
  );
}
