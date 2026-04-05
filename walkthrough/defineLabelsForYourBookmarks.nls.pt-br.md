## Defina Rótulos para Seus Bookmarks

Bookmarks representam posições no seu código, o que permite que você volte de forma rápida e fácil para elas, sempre que necessário. Mas as vezes a posição ou o conteúdo da linha não é tão significativo quanto você gostaria que fosse.. 

Para preencher essa necessidade, você pode definir **Rótulos** a serem associados aos Bookmarks.

Você pode facilmente digitar o **Rótulo** quando você cria o bookmark, ou você pode pedir a extensão para sugerir para você.

Você tem algumas alternativas para escolher:

  * `useWhenSelected`: Usa o texto selecionado _(se disponível)_ diretamente, sem solicitar confirmação.
  * `suggestWhenSelected`: Sugere o texto selecionado _(se disponível)_. Você ainda precisa confirmar.
  * `suggestWhenSelectedOrLineWhenNoSelected`: Sugere o texto selecionado _(se disponível)_ ou a toda a linha (quando não houver seleção). Você ainda precisa confirmar.

<table align="center" width="85%" border="0">
  <tr>
    <td align="center">
      <a title="Abrir Configurações" href="command:workbench.action.openSettings?%5B%22bookmarks.label.suggestion%22%5D">Abrir Configurações</a>
    </td>
  </tr>
</table>

## O texto do rótulo é exibido em linha

![Bookmarks with labels](../images/bookmarks-with-labels-arrowed.png)

Você pode ativar a visibilidade do texto dos rótulos dos bookmarks em linha na mesma linha onde o bookmark etiquetado é colocado, habilitando `bookmarks.label.inline.enabled`.

O texto do rótulo do bookmark aparece ao lado da linha onde o bookmark etiquetado é colocado. Por padrão, parece uma decoração de texto de git blame. Você pode ativar este recurso e personalizar sua aparência com as seguintes configurações:

  * `bookmarks.label.inline.enabled`: Habilite mostrar o texto do rótulo do bookmark ao lado da linha real com o bookmark etiquetado _(`false` por padrão)_
  * `bookmarks.label.inline.margin`: Margem entre o final da linha e o texto do rótulo em linha do bookmark. Faz sentido apenas se a configuração bookmarks.label.inline.enabled estiver habilitada _(`2` por padrão)_
  * `bookmarks.label.inline.fontStyle`: Estilo de fonte do texto do rótulo em linha (por exemplo `"italic"`). Faz sentido apenas se a configuração bookmarks.label.inline.enabled estiver habilitada _(`"normal"` por padrão)_
  * `bookmarks.labelInlineMessageTextColor`: Cor do texto para o texto do rótulo em linha do bookmark. Se não especificado, a mesma cor usada para git blame decoração de texto é utilizada. Faz sentido apenas se a configuração bookmarks.label.inline.enabled estiver habilitada
  * `bookmarks.label.inline.fontWeight`: Espessura da fonte para o texto do rótulo em linha do bookmark. Faz sentido apenas se a configuração bookmarks.label.inline.enabled estiver habilitada _(`400` por padrão)_
  * `bookmarks.labelInlineMessageBackgroundColor`: Cor de fundo para o texto do rótulo em linha do bookmark. Se não especificado, a mesma cor usada para git blame decoração de texto é utilizada. Faz sentido apenas se a configuração bookmarks.label.inline.enabled estiver habilitada

Para alterar a cor do texto/fundo do texto do rótulo em linha do bookmark:
```json
    "workbench.colorCustomizations": {
      "bookmarks.labelInlineMessageTextColor": "#23ca11f3",
      "bookmarks.labelInlineMessageBackgroundColor": "#6161611a",
    }
```
