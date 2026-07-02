import React from 'react';

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-6">
      <div className="bg-paper-light border border-crease-light rounded-[1.5rem] p-5 shadow-sm text-sm text-ink-light space-y-1">
        <p><strong className="text-ink">Effective Date:</strong> June 1, 2026</p>
        <p><strong className="text-ink">Last Updated:</strong> June 1, 2026</p>
      </div>

      <p>
        Welcome to Oristep ("<strong className="text-ink">the App</strong>," "<strong className="text-ink">we</strong>," "<strong className="text-ink">us</strong>," or "<strong className="text-ink">our</strong>"). Oristep is an origami learning and craft utility application. This Privacy Policy explains, in plain language, what information the App does and does not handle, how the App works technically, and your rights regarding your data.
      </p>

      <div className="bg-accent-soft text-ink rounded-2xl p-5 border border-accent/20 shadow-sm">
        <p className="font-semibold text-[15px] leading-relaxed">
          The short version: Oristep does not collect, store, transmit, sell, or share any personal data. Everything you create inside the App — your progress, favorites, and stash — stays on your device.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">1. Information We Collect</h3>
        <p>Oristep is designed around a "zero-collection" architecture. To be fully transparent:</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li><strong className="text-ink">We do not require an account.</strong> There is no sign-up, login, email address, phone number, or social media authentication anywhere in the App. You use Oristep entirely as an anonymous, unauthenticated guest.</li>
          <li><strong className="text-ink">We do not collect personal identifiers.</strong> We do not access or request your name, email, contacts, photos, camera, microphone, precise location, or device identifiers for tracking purposes.</li>
          <li><strong className="text-ink">We do not use analytics or tracking SDKs.</strong> The App contains no third-party analytics libraries, advertising SDKs, crash-tracking services that phone home, or behavioral tracking tools of any kind.</li>
          <li><strong className="text-ink">We do not display ads.</strong> Oristep has no advertising network integrations.</li>
          <li><strong className="text-ink">We do not process payments.</strong> There are no in-app purchases, subscriptions, or third-party payment gateways integrated into the App.</li>
        </ul>
        <p className="text-sm">Because we do not collect personal data, concepts like "data sale," "data sharing with third parties," or "cross-app tracking" — as defined under regulations such as the GDPR and the CCPA — simply do not apply to how Oristep operates. We have nothing to sell or share because we never receive it in the first place.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">2. Your Data Stays On Your Device (Local Storage)</h3>
        <p>All of your activity and personalization inside Oristep is saved <strong className="text-ink">locally on your device only</strong>, using your browser/app's <code className="bg-paper border border-crease px-1.5 py-0.5 rounded text-xs text-accent">localStorage</code> (or equivalent on-device storage). This includes:</p>
        
        <div className="overflow-hidden rounded-xl border border-crease-light">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-light border-b border-crease-light">
              <tr>
                <th className="px-4 py-3 font-semibold text-ink">Data Type</th>
                <th className="px-4 py-3 font-semibold text-ink">Where It Lives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-crease-light bg-paper">
              <tr>
                <td className="px-4 py-3">Learning progress & completed projects</td>
                <td className="px-4 py-3 font-medium text-accent">Local device storage only</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Favorited/bookmarked patterns</td>
                <td className="px-4 py-3 font-medium text-accent">Local device storage only</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Paper stash inventory</td>
                <td className="px-4 py-3 font-medium text-accent">Local device storage only</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Achievements & badges</td>
                <td className="px-4 py-3 font-medium text-accent">Local device storage only</td>
              </tr>
              <tr>
                <td className="px-4 py-3">App settings & configurations</td>
                <td className="px-4 py-3 font-medium text-accent">Local device storage only</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p><strong className="text-ink">This data never leaves your device.</strong> It is not transmitted to us, to Firebase, or to any third party. We have no server-side database of user accounts or user-generated content, and consequently, <strong className="text-ink">we have no technical ability to view, access, recover, or restore this information.</strong></p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li><strong className="text-ink">Uninstalling the App or clearing the App's storage/cache will permanently delete this data</strong>, and we cannot retrieve it for you.</li>
          <li>You are always in full control of this information through your device's own settings.</li>
          <li>No cloud backup, sync, or account-recovery mechanism exists for this data (there being no account to sync it to).</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">3. How Our Backend (Firebase) Is Used</h3>
        <p>Oristep uses <strong className="text-ink">Firebase</strong> solely as a <strong className="text-ink">read-only content delivery backend</strong>. Its only function is to serve the App's published, publicly available origami patterns, diagrams, and step-by-step instructions to your device.</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li>The App only <strong className="text-ink">fetches</strong> content from our Firebase database — it does not <strong className="text-ink">write, upload, or transmit</strong> any information about you, your device, or your usage to Firebase.</li>
          <li>No user-generated content (your progress, favorites, stash, etc.) is ever sent to or stored on Firebase or any other server.</li>
          <li>Standard, unavoidable technical connection data (such as your IP address and basic request metadata) may transiently pass through our hosting/network infrastructure as an inherent function of any internet request, exactly as it would when loading any website. This data is not logged for tracking or profiling purposes, is not linked to any identity, and is not used by us for any analytical purpose.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">4. Android "Internet" Permission</h3>
        <p>Oristep requests the standard Android <code className="bg-paper border border-crease px-1.5 py-0.5 rounded text-xs text-accent">INTERNET</code> permission. This permission is used <strong className="text-ink">exclusively</strong> to:</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li>Download the publicly available origami pattern library (diagrams, instructions, images) from our Firebase backend so the content displays correctly in the App.</li>
        </ul>
        <p className="text-sm">This permission is <strong className="text-ink">not</strong> used for advertising, analytics, tracking, background data harvesting, or any purpose beyond retrieving the craft content described above. If your device is offline, previously loaded content may still be accessible, but new patterns cannot be fetched until connectivity is restored.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">5. No Sale or Sharing of Personal Data</h3>
        <p>We want to state this as plainly and as bindingly as possible:</p>
        <div className="border-l-4 border-accent pl-4 py-2 my-4">
          <strong className="text-ink text-lg leading-snug">Oristep does not sell, rent, trade, or share personal data with third parties, advertisers, data brokers, or any other entity — because Oristep does not collect personal data in the first place.</strong>
        </div>
        <p>This applies equally under:</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li>The <strong className="text-ink">General Data Protection Regulation (GDPR)</strong> — we do not act as a data controller or processor of personal data in connection with your use of the App, as no personal data is collected.</li>
          <li>The <strong className="text-ink">California Consumer Privacy Act (CCPA/CPRA)</strong> — we have no "sale" or "sharing" of personal information to disclose, and there is no personal information for you to request, delete, or opt out of, as none is collected or retained by us.</li>
        </ul>
        <p className="text-sm">If, in the future, this changes (for example, if we introduce optional cloud sync or accounts), we will update this Policy in advance and clearly disclose any new data practices before they take effect.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">6. Children's Privacy</h3>
        <p>Oristep is a general-audience craft and educational utility app that is <strong className="text-ink">safe for users of all ages</strong>, including children, as it contains no ads, no chat features, no social functionality, and no mechanism to collect personal information from anyone.</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li>We do <strong className="text-ink">not</strong> knowingly or intentionally collect any personal data from children under 13 (or the relevant age of digital consent in your region), consistent with the <strong className="text-ink">Children's Online Privacy Protection Act (COPPA)</strong> and similar regulations.</li>
          <li>Since the App has no accounts, no forms, and no data-collection mechanisms whatsoever, this protection is structural rather than policy-based — there is no data collection pathway through which a child's (or anyone's) personal information could be gathered.</li>
          <li>If a parent or guardian believes that, contrary to the App's design, any personal data has been inadvertently collected from a child, please contact us using the details in Section 10 and we will investigate promptly.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">7. Data Security</h3>
        <p>Because no personal or account data is transmitted to or stored on our servers, the primary security consideration is the read-only content delivered to your device, and any data you store locally is protected by your own device's built-in security (screen lock, encryption, OS-level app sandboxing, etc.). We recommend keeping your device's operating system updated to benefit from the latest security protections.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">8. Your Rights and Choices</h3>
        <p>Under regulations such as the GDPR and CCPA, individuals typically have rights to access, correct, delete, or export their personal data. Since Oristep does not collect or hold any personal data on our servers, there is no personal data for us to act upon. Instead, you retain full and direct control over your locally stored App data at all times:</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
          <li><strong className="text-ink">To view or use your data:</strong> It's already on your device, within the App.</li>
          <li><strong className="text-ink">To delete your data:</strong> Clear the App's storage/cache or uninstall the App via your device settings.</li>
          <li><strong className="text-ink">To "export" your data:</strong> No mechanism currently exists, as data is intentionally kept local-only and lightweight.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">9. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time to reflect changes in the App's functionality, legal requirements, or best practices. Any changes will be posted on this page with a revised "Last Updated" date. If we ever introduce a feature that changes our data practices (such as optional accounts or cloud sync), we will update this Policy beforehand and, where required by law, seek your consent.</p>
        <p>We encourage you to review this Policy periodically. Continued use of the App after changes take effect constitutes acceptance of the revised Policy.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl text-ink font-bold pt-4 border-t border-crease-light">10. Contact Information</h3>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or the App's data practices, please contact us at:</p>
        <div className="bg-paper-light border border-crease-light rounded-xl p-4 flex items-center justify-center">
          <a href="mailto:ouhsineabdelali@gmail.com" className="text-accent font-bold hover:underline flex items-center">
            <span className="mr-2">📧</span> ouhsineabdelali@gmail.com
          </a>
        </div>
        <p className="text-sm mt-2">We aim to respond to all privacy-related inquiries in a timely manner.</p>
      </div>

      <div className="pt-8 text-[11px] text-ink-light/60 text-center italic border-t border-crease-light mt-8 pb-32">
        This Privacy Policy was written to comply with the Google Play Developer Program Policies, the EU General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA/CPRA) as in effect in 2026. It is provided for general informational purposes and does not constitute legal advice specific to your jurisdiction or business circumstances.
      </div>
    </div>
  );
}
