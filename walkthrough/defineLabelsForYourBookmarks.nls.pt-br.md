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

![Bookmarks with labels](../images/bookmarks-with-lables-arrrowed.png)

Por padrão, o texto do rótulo do favorito aparece ao lado da linha onde o favorito rotulado está colocado. Por padrão, ele se parece com uma dica embutida (inlay hint). Você pode personalizar a aparência desse texto (ou desativá-lo) com as seguintes configurações:

  * `bookmarks.enableLabelInlineMessage`: Habilita a exibição do texto do rótulo do favorito ao lado da linha real com favorito rotulado _(`true` por padrão)_
  * `bookmarks.labelInlineMessageMargin`: Margem entre o fim da linha e o texto em linha do rótulo do favorito. Só faz sentido se a configuração bookmarks.enableLabelInlineMessage estiver habilitada _(`2` por padrão)_
  * `bookmarks.labelInlineMessageItalic`: Deixa o texto em linha do rótulo do favorito em itálico. Só faz sentido se a configuração bookmarks.enableLabelInlineMessage estiver habilitada _(`false` por padrão)_
  * `bookmarks.labelInlineMessageTextColor`: Cor do texto para o texto em linha do rótulo do favorito. Se não for especificada, é usada a mesma cor das dicas embutidas (inlay hints). Só faz sentido se a configuração bookmarks.enableLabelInlineMessage estiver habilitada
  * `bookmarks.labelInlineMessageBackgroundColor`: Cor de fundo para o texto em linha do rótulo do favorito. Se não for especificada, é usada a mesma cor das dicas embutidas (inlay hints). Só faz sentido se a configuração bookmarks.enableLabelInlineMessage estiver habilitada
  * `bookmarks.labelInlineMessageFontWeight`: Espessura da fonte para o texto em linha do rótulo do favorito. Só faz sentido se a configuração bookmarks.enableLabelInlineMessage estiver habilitada _(`450` por padrão)_
