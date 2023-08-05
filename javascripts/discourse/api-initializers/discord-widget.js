import {apiInitializer} from "discourse/lib/api";
import User from "discourse/models/user";

export default apiInitializer("0.11.1", (api) => {
    // If login is required
    if (settings.require_login && !api.getCurrentUser()) {
        return;
    }

    // If a trust level is required
    if (User.currentProp("trust_level") < settings.minimum_trust_level) {
        return;
    }

    // If user must be staff
    if (settings.require_staff && !api.getCurrentUser().staff) {
        return;
    }

    // If user must be a group member
    if (settings.required_groups.length > 0) {
        const requiredGroups = settings.required_groups
            .split("|")
            .map((g) => Number(g));

        const currentUserGroups = api.getCurrentUser().groups.map((g) => g.id);

        if (!currentUserGroups.some((g) => requiredGroups.includes(g))) {
            return;
        }
    }

    let res = window.location.href.match(/\/t\/(.*?)\/(\w+)/);
    if (res && res[2] > 0) {
    } else {
        return;
    }

    api.decorateWidget("header-icons:before", (helper) => {
        const headerState = helper.widget.parentWidget.state;
        return helper.attach("header-dropdown", {
            title: themePrefix("anonymouspost_widget.title"),
            icon: "reply", // original fab-discord
            active: headerState.anonymouspostChatVisible,
            action: "toggleanonymouspost",
            classNames: ["anonymouspost-button"],
        });
    });

    api.decorateWidget("header-icons:after", (helper) => {
        const headerState = helper.widget.parentWidget.state;
        if (headerState.anonymouspostChatVisible) {
            return [helper.attach("anonymouspost-chat-menu")];
        }
    });

    api.attachWidgetAction("header", "toggleanonymouspost", function () {
        this.state.anonymouspostChatVisible = !this.state.anonymouspostChatVisible;
    });
    const toggleAnonReplyToTopic = function() {
        this.sendWidgetAction("toggleanonymouspost");
        return res
    };

    const currentLocale = I18n.currentLocale();
    if (!I18n.translations[currentLocale].js.composer) {
        I18n.translations[currentLocale].js.composer = {};
        I18n.translations["en"].js.composer = {};
        I18n.translations["zh_CN"].js.composer = {};
    }
    I18n.translations["en"].js.anon_reply_to_topic_icon_text = "Reply Anonymously";
    I18n.translations["zh_CN"].js.anon_reply_to_topic_icon_text = "匿名回复该话题";
    I18n.translations[currentLocale].js.anon_reply_to_topic_icon_text = "Anonymously Reply";
    let a = function (e) {
        console.log(e);
        return e.applySurround('<div data-theme="foo">\n\n', "\n\n</div>", "my_button_text");
    }
    api.registerTopicFooterButton({
        id: "replytotopic-button",
        icon: "reply",
        title: "Reply Anonymously",
        label: "anon_reply_to_topic_icon_text",
        action(context) {
            a
        },

        // action: this.toggleAnonReplyToTopic
    })

});
