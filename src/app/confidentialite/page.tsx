import Link from 'next/link'

export const metadata = {
  title: 'Politique de Confidentialité — ProfitSnap',
}

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav minimale */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">ProfitSnap</Link>
        <Link href="/app/calculator" className="text-sm text-gray-500 hover:text-gray-900">
          Retour à l&apos;app
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-400 mb-12">Dernière mise à jour : avril 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Données collectées</h2>
            <p>ProfitSnap collecte uniquement les données strictement nécessaires au fonctionnement du service :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Adresse email</strong> — pour l&apos;authentification et les communications liées au compte</li>
              <li><strong>Calculs sauvegardés</strong> — prix d&apos;achat, prix de vente, frais de livraison, catégorie et résultats associés</li>
              <li><strong>Données de facturation</strong> — gérées intégralement par Stripe (plan Pro). ProfitSnap ne stocke pas vos données bancaires.</li>
            </ul>
            <p className="mt-3">
              Aucun tracking publicitaire. Aucune revente de données. Aucun cookie tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Vous authentifier et vous donner accès à votre compte</li>
              <li>Afficher votre historique de calculs</li>
              <li>Gérer les limites du plan gratuit (3 calculs/jour)</li>
              <li>Traiter votre abonnement Pro via Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Stockage et sécurité</h2>
            <p>
              Les données sont stockées sur des serveurs Supabase (hébergement EU).
              Les connexions sont chiffrées via HTTPS. Les mots de passe ne sont jamais stockés en clair.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Sous-traitants</h2>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Supabase</strong> — base de données et authentification</li>
              <li><strong>Stripe</strong> — traitement des paiements (plan Pro)</li>
              <li><strong>Vercel</strong> — hébergement de l&apos;application</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500">
              Ces prestataires sont soumis à des engagements contractuels de protection des données conformes au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, supprimez votre compte depuis la page Compte ou contactez-nous
              directement. Nous répondons sous 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Durée de conservation</h2>
            <p>
              Les données sont conservées tant que votre compte est actif.
              En cas de suppression du compte, l&apos;ensemble des données associées est supprimé
              dans un délai de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
            <p>
              Pour toute question relative à vos données personnelles, contactez-nous via la page
              de compte ou l&apos;adresse indiquée lors de votre inscription.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-6 px-6 text-center text-xs text-gray-400">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-gray-600">ProfitSnap</Link>
          <Link href="/cgu" className="hover:text-gray-600">CGU</Link>
          <Link href="/confidentialite" className="hover:text-gray-600">Confidentialité</Link>
        </div>
        <p className="mt-2">© 2026 ProfitSnap — Outil d&apos;aide à la décision pour revendeurs eBay</p>
      </footer>
    </main>
  )
}
