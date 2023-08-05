import {createWidget} from "discourse/widgets/widget";
import {h} from "virtual-dom";
import panelMessage from "../lib/panel-message";
import getTheme from "../lib/theme";
import DiscourseURL from "discourse/lib/url";

createWidget("anonymouspost-chat-menu", {
    tagName: "div.anonymouspost-panel",

    html() {
        const replyURLbase = `https://anonymouspost.xjtu.live/xjtumen-custom-api/handle-reply-to-topic/`;
        // const replyURLbase = `http://127.0.0.1:7010/xjtumen-custom-api/handle-reply-to-topic/`;
        let replyURL;
        let allowReply = false;
        // allowReply = this.siteSettings.requ`ire_login;

        const register = this.register;
        const router = register.lookup("router:main");

        try {
            var res = router.currentURL.match(/\/t\/(.*?)\/(\w+)/);
            if (res && res[2] > 0) {
                replyURL = replyURLbase + res[2] + "/" +  document.title
            } else {
                allowReply = false;
                replyURL = replyURLbase;
            }
        } catch (e) {
            replyURL = replyURLbase;
        }
        // if (!allowReply) {
        //     return
        // }

        if (this.site.mobileView) {
            return DiscourseURL.routeTo(replyURL);
        }

        return this.attach("menu-panel", {
            contents: () =>
                h("iframe", {
                    src: replyURL,
                    sandbox:
                        "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts",
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
