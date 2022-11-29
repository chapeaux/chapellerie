var isUserDataSet = false;

function setUserData(event) {
  if (isUserDataSet) {
    return;
  }
  var RHAccountDropdown = null;
  if (event.type === "rh-account-dropdown:ready") {
    RHAccountDropdown = event.detail.component;
  } else {
    RHAccountDropdown = document.querySelector("rh-account-dropdown");
  }

  if (RHAccountDropdown) {
    if (!RHAccountDropdown.hasAttribute("login-link")) {
      RHAccountDropdown.setAttribute("login-link", "#login");
    }
    if (!RHAccountDropdown.hasAttribute("logout-link")) {
      RHAccountDropdown.setAttribute("logout-link", "#logout");
    }

    RHAccountDropdown.userData = {
      realm_access: {
        roles: ["admin:org:all", "portal_manage_subscriptions"],
      },
      REDHAT_LOGIN: "wesruv@wakka-wakka.com",
      lastName: "Ruvalcaba",
      account_number: "123456",
      preferred_username: "wesruv@wakka-wakka.com",
      firstName: "Wes",
      email: "wesruv@wakka-wakka.com",
      username: "wesruv@wakka-wakka.com",
    };

    isUserDataSet = true;
  }
}

window.addEventListener("rh-account-dropdown:ready", setUserData);
window.addEventListener("load", setUserData);
