# Documentation Maintenance - Horaires Publics

## Vue d'ensemble
Système de synchronisation automatique des horaires publics entre le planning interne et le site web.

---

## 🔧 Configuration globale

**Fichier:** `server/data/public-hours-config.json` (côté planning)

```json
{
  "baseHours": {
    "mon": { "isOpen": false },
    "tue": { "isOpen": true, "openTime": "07:00", "closeTime": "17:00" },
    "wed": { "isOpen": true, "openTime": "07:00", "closeTime": "17:00" },
    "thu": { "isOpen": true, "openTime": "07:00", "closeTime": "17:00" },
    "fri": { "isOpen": true, "openTime": "07:00", "closeTime": "17:00" },
    "sat": { "isOpen": true, "openTime": "11:00", "closeTime": "17:00" },
    "sun": { "isOpen": false }
  },
  "happyHourFriday": {
    "enabled": true,
    "openTime": "07:00",
    "closeTime": "20:00",
    "noteText": "Happy hour"
  },
  "brunchRule": {
    "enabled": true,
    "weekOfMonth": 2,
    "weekday": "sun",
    "openTime": "11:00",
    "closeTime": "15:00",
    "noteText": "Brunch"
  },
  "highSeason": {
    "periods": [],
    "mondayHours": { "openTime": "11:00", "closeTime": "17:00", "noteText": "Haute saison" }
  },
  "closureNoteText": "Fermeture exceptionnelle"
}
```

### Modification de la config
1. Éditer `planning-cafe/server/data/public-hours-config.json`
2. Relancer le serveur planning
3. Déclencher une sync manuelle depuis l'UI planning

---

## 🧪 Lancer les tests E2E

### Test Highlights (événements à la une)
```powershell
cd "c:\Users\Arthur\Documents\site internet"
$env:PLANNING_SYNC_TOKEN="9fK2xP7mQ4rT8vL1zN6aB3wH5yC0uD"
node scripts/planning-sync-e2e.js
```

### Test Hours (horaires publics)
```powershell
cd "c:\Users\Arthur\Documents\site internet"
$env:PLANNING_SYNC_TOKEN="9fK2xP7mQ4rT8vL1zN6aB3wH5yC0uD"
node scripts/planning-hours-e2e.js
```

**Résultat attendu:** `✅ ALL TESTS PASSED`

---

## 🌐 Endpoints de synchronisation

| Endpoint | Méthode | Usage |
|----------|---------|-------|
| `/api/internal/planning-sync` | POST | Réception highlights (events) |
| `/api/internal/planning-sync` | GET | Debug - liste highlights stockés |
| `/api/internal/planning-hours-sync` | POST | Réception horaires publics |
| `/api/internal/planning-hours-sync` | GET | Debug - liste horaires stockés |
| `/api/planning/public-hours-preview` | GET | Preview admin (planning) |

### Authentification
Header requis: `Authorization: Bearer <PLANNING_SYNC_TOKEN>`

---

## 📋 Règles métier actives

### Horaires de base
| Jour | Horaires |
|------|----------|
| Mar-Jeu | 07:00 - 17:00 |
| Ven | 07:00 - 20:00 (happy hour) |
| Sam | 11:00 - 17:00 |
| Dim | Fermé (sauf 2e dimanche) |
| Lun | Fermé (sauf haute saison) |

### Règles spéciales (priorité croissante)
1. **Happy hour** (vendredi) → ferme à 20:00
2. **Brunch** (2e dimanche du mois) → ouvert 11:00-15:00
3. **Haute saison** (lundi en période définie) → ouvert 11:00-17:00
4. **Closure** (événement planning) → **écrase tout**, jour fermé

### Résolution des conflits
Si plusieurs entrées pour une même date : **closure gagne toujours**

---

## 🖥️ Preview admin

**Accessible dans:** Planning App → Sidebar (admin uniquement)

**Composant:** `src/planning/components/PublicHoursPreview.tsx`

Affiche :
- 7 prochains jours calculés
- Source de chaque règle (base, happy_hour, brunch, high_season, closure)
- Refresh automatique toutes les 5 minutes

---

## 📁 Fichiers clés

### Planning (backend)
- `server/index.js` - Logique de calcul et endpoints API
- `server/data/public-hours-config.json` - Configuration globale

### Site (frontend + API)
- `lib/planning-hours.ts` - Stockage et déduplication
- `app/api/internal/planning-hours-sync/route.ts` - Endpoint réception
- `components/OpeningHours.tsx` - Affichage bloc horaires
- `components/Footer.tsx` - Affichage pied de page

### Tests
- `scripts/planning-hours-e2e.js` - Test complet A-J
- `scripts/planning-sync-e2e.js` - Test highlights

---

## ⚠️ Rappels importants

1. **Déduplication automatique** côté site (closure prioritaire)
2. **Fallback** vers horaires statiques si pas de données sync'd
3. **Token requis** dans `.env` : `PLANNING_SYNC_TOKEN`
4. **Pas de logs de debug** en production (nettoyés)
