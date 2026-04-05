## Definieer labels voor je bladwijzers

Bladwijzers zijn posities in je code, waardoor je gemakkelijk en snel terug kunt gaan wanneer dat nodig is. Maar soms heeft de positie of de inhoud van die regel niet zo veel betekenis.

Daarom kun je **Labels** definiëren die aan de bladwijzer zijn gekoppeld.

Je kunt eenvoudig je eigen **Label** opgeven wanneer je een bladwijzer aan-/uitzet, of je kunt de extensie vragen om een suggestie te doen.

Je hebt een aantal opties om uit te kiezen:

- `useWhenSelected`: Direct de geselecteerde tekst gebruiken _(indien beschikbaar)_, geen bevestiging vereist
- `suggestWhenSelected`: Stelt de geselecteerde tekst voor _(indien beschikbaar)_. Je moet nog steeds bevestigen.
- `suggestWhenSelectedOrLineWhenNoSelected`: Stelt de geselecteerde tekst voor _(indien beschikbaar)_ of de gehele regel _(wanneer er geen selectie is)_. Je moet nog steeds bevestigen.

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Instellingen openen" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Instellingen openen</a>
    </td>
  </tr>
</table>

## Labeltekst wordt inline weergegeven

![Bladwijzers met labels](../images/bookmarks-with-labels-arrowed.png)

Je kunt de zichtbaarheid van bladwijzerlabeltekst inline inschakelen op dezelfde regel waar de gelabelde bladwijzer zich bevindt via `bookmarks.label.inline.enabled`.

De bladwijzerlabeltekst verschijnt naast de regel waar de gelabelde bladwijzer is geplaatst. Standaard ziet het er uit als de tekstdecoratie van git blame. Je kunt deze functie inschakelen en de weergave aanpassen via de volgende instellingen:

  * `bookmarks.label.inline.enabled`: Schakel het weergeven van bladwijzerlabeltekst naast de werkelijke regel met gelabelde bladwijzer in _(`false` standaard)_
  * `bookmarks.label.inline.margin`: Marge tussen het einde van de regel en de inline bladwijzerlabeltekst. Alleen zinvol als de instelling bookmarks.label.inline.enabled is ingeschakeld _(`2` standaard)_
  * `bookmarks.label.inline.fontStyle`: Lettertypestijl van inline labeltekst (bijv. `"italic"`). Alleen zinvol als de instelling bookmarks.label.inline.enabled is ingeschakeld _(`"normal"` standaard)_
  * `bookmarks.labelInlineMessageTextColor`: Tekstkleur voor inline bladwijzerlabeltekst. Als niet opgegeven, wordt dezelfde kleur als voor de git blame tekstdecoratie gebruikt. Alleen zinvol als de instelling bookmarks.label.inline.enabled is ingeschakeld
  * `bookmarks.label.inline.fontWeight`: Letterdikte voor inline bladwijzerlabeltekst. Alleen zinvol als de instelling bookmarks.label.inline.enabled is ingeschakeld _(`400` standaard)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Achtergrondkleur voor inline bladwijzerlabeltekst. Als niet opgegeven, wordt dezelfde kleur als voor de git blame tekstdecoratie gebruikt. Alleen zinvol als de instelling bookmarks.label.inline.enabled is ingeschakeld

Om de tekstkleur/achtergrondkleur van inline bladwijzerlabeltekst te wijzigen:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
