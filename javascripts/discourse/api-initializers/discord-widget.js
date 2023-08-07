import {apiInitializer} from "discourse/lib/api";
import User from "discourse/models/user";
import DiscourseURL from "discourse/lib/url";

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

    // BUGGY: only show in topic page
    // NOT NEEDED: we now treat request /xjtumen-custom-api/handle-reply-to-topic/ as starting a new topic
    // let res = window.location.href.match(/\/t\/(.*?)\/(\w+)/);
    // if (res && res[2] > 0) {
    // } else {
    //     return;
    // }

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
        if (this.site.mobileView) {
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
            DiscourseURL.redirectAbsolute(replyURL);
            return
        }

        this.state.anonymouspostChatVisible = !this.state.anonymouspostChatVisible;
    });

});
