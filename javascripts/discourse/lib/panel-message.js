import { h } from "virtual-dom";
import I18n from "I18n";
import { iconNode } from "discourse-common/lib/icon-library";

export default function panelMessage(type, message, icon) {
  return h(`div.panel-message.panel-message-type-${type}`, [
    iconNode(icon),
    I18n.t(themePrefix(message)),
  ]);
}
