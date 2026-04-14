import Link from 'next/link'

export const metadata = {
  title: 'Conditions Générales d\'Utilisation — ProfitSnap',
}

export default function CGUPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-sm text-gray-400 mb-12">Dernière mise à jour : avril 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Présentation du service</h2>
            <p>
              ProfitSnap est un outil d&apos;aide à la décision destiné aux revendeurs sur eBay France.
              Il permet d&apos;estimer la rentabilité d&apos;un produit à partir de données saisies par l&apos;utilisateur :
              prix d&apos;achat, prix de vente estimé, frais de livraison et catégorie eBay.
            </p>
            <p className="mt-2">
              Les résultats fournis sont des <strong>estimations</strong> basées sur la grille tarifaire
              publique d&apos;eBay France (2024). Ils ne constituent en aucun cas une garantie de résultat,
              un conseil financier ou une promesse de gain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Accès au service</h2>
            <p>
              L&apos;accès au calculateur nécessite la création d&apos;un compte. Un plan gratuit est disponible
              avec 3 calculs sauvegardés par jour. Un plan Pro à 19€/mois donne accès à des calculs illimités
              et à l&apos;historique complet.
            </p>
            <p className="mt-2">
              ProfitSnap se réserve le droit de modifier, suspendre ou interrompre le service à tout moment,
              avec un préavis raisonnable dans la mesure du possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Responsabilité</h2>
            <p>
              ProfitSnap fournit un outil d&apos;estimation. Les frais eBay réels dépendent de nombreux facteurs
              (statut du compte vendeur, promotions en cours, catégorie exacte, frais optionnels) et peuvent
              différer des estimations affichées.
            </p>
            <p className="mt-2">
              L&apos;utilisateur est seul responsable de ses décisions d&apos;achat et de vente.
              ProfitSnap ne saurait être tenu responsable de pertes financières résultant de l&apos;utilisation
              de l&apos;outil.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Données personnelles</h2>
            <p>
              Les données collectées sont limitées à l&apos;adresse email de l&apos;utilisateur et aux calculs
              sauvegardés. Elles ne sont ni vendues ni transmises à des tiers.
              Consultez notre{' '}
              <Link href="/confidentialite" className="text-green-600 underline hover:text-green-700">
                politique de confidentialité
              </Link>{' '}
              pour plus de détails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Propriété intellectuelle</h2>
            <p>
              Le contenu du site ProfitSnap (code, textes, interface) est la propriété exclusive de son éditeur.
              Toute reproduction ou utilisation non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Modification des CGU</h2>
            <p>
              Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront informés
              des changements significatifs par email ou par notification dans l&apos;application.
              La poursuite de l&apos;utilisation du service vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l&apos;adresse
              indiquée sur la page de compte.
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
