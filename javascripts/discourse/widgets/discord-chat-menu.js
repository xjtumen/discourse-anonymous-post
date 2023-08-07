import {createWidget} from "discourse/widgets/widget";
import {h} from "virtual-dom";
import panelMessage from "../lib/panel-message";
import getTheme from "../lib/theme";
import DiscourseURL from "discourse/lib/url";

createWidget("anonymouspost-chat-menu", {
    tagName: "div.anonymouspost-panel",

    html() {
        const replyURLbase = 'https://' + window.location.hostname + '/xjtumen-custom-api/handle-reply-to-topic/'  + window.location.hostname + '/';

        let replyURL = replyURLbase;

        try {
            var res = window.location.href.match(/\/t\/(.*?)\/(\w+)/);
            if (res && res[2] > 0) {
                replyURL = replyURLbase + res[2] + "/" + document.title;
            }
        } catch (e) {
            replyURL = replyURLbase;
        }

        // if (this.site.mobileView) {
        //     return DiscourseURL.routeTo(replyURL);
        // }

        return this.attach("menu-panel", {
            contents: () =>
                h("iframe", {
                    src: replyURL,
                    sandbox:
                        "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-forms",
                    width: "350",
                    height: "500",
                    allowtransparency: "true",
                    frameborder: "0",
                    id: "chatwidget",
                    name: "chatwidget",
                }),
        });
    },

    clickOutside() {
        this.sendWidgetAction("toggleanonymouspost");
    },
});
