import PFElement from "../../../@patternfly/pfelement/dist/pfelement.js"; // | umd
import "../../../@patternfly/pfe-avatar/dist/pfe-avatar.js"; // | umd

// @todo Allow links in 1rst and 2nd column from loaded site
// @todo Missing some account information

class RHAccountDropdown extends PFElement {
  static get tag() {
    return "rh-account-dropdown";
  }

  static get meta() {
    return {
      title: "Account Dropdown for Red Hat navigation",
      description: "",
    };
  }

  get templateUrl() {
    return "rh-account-dropdown.html";
  }

  get styleUrl() {
    return "rh-account-dropdown.scss";
  }

  get userData() {
    return this._userData;
  }

  set userData(userData) {
    this._processUserData(userData);
  }

  static get events() {
    return {
      ready: `${this.tag}:ready`,
      shadowDomInteraction: "pfe-shadow-dom-event",
    };
  }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Content;
  }

  static get properties() {
    return {
      // Using _lang to avoid namespacing issue with HTMLElement.lang
      _lang: {
        title: "Language support",
        attr: "lang",
        type: String,
        default: "en",
        observer: "_handleLanguageChange",
      },
      loginLink: {
        title: "Login link",
        type: String,
      },
      logoutLink: {
        title: "Logout link",
        type: String,
      },
      avatarUrl: {
        title: "Avatar URL",
        type: String,
      },
      fullName: {
        title: "Full name",
        type: String,
      },
      environment: {
        title: "Site environment",
        attribute: "environment",
        type: String,
        values: ["", "dev", "qa", "stage"],
      },
    };
  }

  static get slots() {
    return {};
  }

  constructor() {
    super(RHAccountDropdown, { type: RHAccountDropdown.PfeType });

    // Setup vars
    this._userData = null;
    this._avatarElements = [];

    // Translations
    this._navTranslations = {
      en: {
        accountDetails: "Account details",
        accountDetailsDesc:
          "Edit your contact info, password, location preferences, and errata notifications.",
        accountNumber: "Account number",
        accountTeam: "Account team",
        accountTeamDesc: "Get help from your Red Hat account team.",
        avatarEdit: "Edit avatar",
        login: "Login",
        logout: "Log out",
        orgAdmin: "Organization administrator",
        profile: "Community profile",
        profileDesc:
          "Fill out your public profile and control what content you follow.",
        subscriptions: "Subscriptions",
        subscriptionsDesc: "Manage your subscriptions.",
        support: "Support",
        supportDesc: "Get support for your Red Hat products.",
        training: "Training & certification",
        trainingDesc:
          "Access your Red Hat Learning Subscription, courses, and exams.",
        userManagement: "User management",
        userManagementDesc: "Manage users in your organization.",
      },
      ja: {
        accountDetails: "アカウント情報",
        accountDetailsDesc:
          "連絡先情報、パスワード、地域、エラータ通知の設定を編集できます。",
        accountNumber: "アカウント番号",
        accountTeam: "Account team",
        accountTeamDesc:
          "担当の Red Hat アカウントチームからサポートを受けられます。",
        avatarEdit: "アバターを編集する",
        login: "ログイン",
        logout: "ログアウト",
        orgAdmin: "組織管理者",
        profile: "コミュニティプロフィール",
        profileDesc:
          "公開プロフィールの入力と、フォローするコンテンツの管理を行えます。",
        subscriptions: "サブスクリプション",
        subscriptionsDesc: "サブスクリプションを管理できます。",
        support: "サポート",
        supportDesc: "Red Hat 製品のサポートを受けられます。",
        training: "トレーニングと認定資格",
        trainingDesc:
          "Red Hat ラーニングサブスクリプション、コース、試験にアクセスできます。",
        userManagement: "ユーザー管理",
        userManagementDesc: "組織内のユーザーを管理できます。",
      },
      ko: {
        accountDetails: "계정 정보",
        accountDetailsDesc:
          "연락처 정보, 비밀번호, 위치 기본 설정 및 정오표 알림을 선택하세요.",
        accountNumber: "계정 번호",
        accountTeam: "Account team",
        accountTeamDesc: "Red Hat 어카운트 팀의 도움을 받으세요.",
        avatarEdit: "아바타 편집",
        login: "로그인",
        logout: "로그아웃",
        orgAdmin: "기업 관리자",
        profile: "커뮤니티 프로필",
        profileDesc: "공개 프로필을 작성하고 관심있는 콘텐츠를 선택하세요.",
        subscriptions: "서브스크립션",
        subscriptionsDesc: "서브스크립션을 관리하세요.",
        support: "지원",
        supportDesc: "Red Hat 제품에 대한 지원을 받으세요.",
        training: "교육 및 자격증",
        trainingDesc:
          "Red Hat 교육 서브스크립션, 교육 과정, 시험에 액세스하세요.",
        userManagement: "사용자 관리",
        userManagementDesc: "귀하의 비즈니스 사용자를 관리하세요.",
      },
      zh: {
        accountDetails: "账户详情",
        accountDetailsDesc: "编辑您的联系信息、密码、位置首选项和勘误通知。",
        accountNumber: "账户号码",
        accountTeam: "Account team",
        accountTeamDesc: "从您的红帽客户团队获取帮助。",
        avatarEdit: "编辑头像",
        login: "登录",
        logout: "退出",
        orgAdmin: "机构管理员",
        profile: "社区个人资料",
        profileDesc: "填写您的个人公开资料，选择想要关注的内容。",
        subscriptions: "订阅管理",
        subscriptionsDesc: "管理您的订阅。",
        support: "服务支持",
        supportDesc: "获取红帽产品支持。",
        training: "培训与认证",
        trainingDesc: "访问您的红帽培训订阅、课程和考试。",
        userManagement: "用户管理",
        userManagementDesc: "管理您企业中的用户。",
      },
      de: {
        accountDetails: "Kontodaten",
        accountDetailsDesc:
          "Kontaktdaten, Passwort, Standortpräferenzen und Errata-Benachrichtigungen bearbeiten.",
        accountNumber: "Account number",
        accountTeam: "Account team",
        accountTeamDesc:
          "Unterstützung von Ihrem Red Hat Account Team erhalten.",
        avatarEdit: "Avatar ändern",
        login: "Anmelden",
        logout: "Abmelden",
        orgAdmin: "Organisationsadministrator",
        profile: "Community-Profil",
        profileDesc:
          "Öffentliches Profil erstellen und bestimmen, welchen Inhalten Sie folgen.",
        subscriptions: "Subskriptionen",
        subscriptionsDesc: "Ihre Subskriptionen verwalten.",
        support: "Support",
        supportDesc: "Unterstützung für Ihre Red Hat Produkte erhalten.",
        training: "Training und Zertifizierung",
        trainingDesc:
          "Auf Ihre Red Hat Learning Subscription, Kurse und Prüfungen zugreifen.",
        userManagement: "Benutzerverwaltung",
        userManagementDesc: "Benutzer in Ihrer Organisation verwalten.",
      },
      fr: {
        accountDetails: "Détails de mon compte",
        accountDetailsDesc:
          "Modifiez vos coordonnées, votre mot de passe, votre localisation et les notifications sur les correctifs.",
        accountNumber: "Account number",
        accountTeam: "Account team",
        accountTeamDesc: "Demandez de l'aide à votre équipe Red Hat.",
        avatarEdit: "Modifiez votre avatar",
        login: "Connexion",
        logout: "Déconnexion",
        orgAdmin: "Administrateur d'entreprise",
        profile: "Profil communauté",
        profileDesc:
          "Créez votre profil public et choisissez le contenu qui vous intéresse.",
        subscriptions: "Souscriptions",
        subscriptionsDesc: "Gérez vos souscriptions.",
        support: "Assistance",
        supportDesc: "Obtenez de l'aide sur vos produits Red Hat.",
        training: "Formations et certifications",
        trainingDesc:
          "Accédez à votre souscription Red Hat Learning et à nos cours et examens.",
        userManagement: "Gestion des utilisateurs",
        userManagementDesc: "Gérez les utilisateurs de votre entreprise.",
      },
      it: {
        accountDetails: "Il mio account",
        accountDetailsDesc:
          "Modifica le tue modalità di contatto, di notifica delle correzioni, password e posizione.",
        accountNumber: "Account number",
        accountTeam: "Account team",
        accountTeamDesc: "Chiedi aiuto al tuo team di Red Hat dedicato.",
        avatarEdit: "Modifica avatar",
        login: "Accedi",
        logout: "Esegui il log out",
        orgAdmin: "Amministratore organizzazione",
        profile: "Profilo community",
        profileDesc:
          "Compila il tuo profilo pubblico e scegli i contenuti su cui ricevere aggiornamenti.",
        subscriptions: "Sottoscrizioni",
        subscriptionsDesc: "Gestisci le tue sottoscrizioni.",
        support: "Supporto",
        supportDesc: "Richiedi assistenza per i tuoi prodotti Red Hat. ",
        training: "Formazione e certificazione",
        trainingDesc:
          "Accedi alla tua Red Hat Learning Subscription, ai corsi e agli esami.",
        userManagement: "Gestione utenti",
        userManagementDesc: "Gestisci gli utenti della tua organizzazione.",
      },
      es: {
        accountDetails: "Información de la cuenta",
        accountDetailsDesc:
          "Modifique su información de contacto, su contraseña, sus preferencias de ubicación y sus notificaciones de errores.",
        accountNumber: "Account number",
        accountTeam: "Account team",
        accountTeamDesc: "Obtenga asistencia del equipo de cuentas de Red Hat.",
        avatarEdit: "Modifique su avatar",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        orgAdmin: "Administrador de la empresa",
        profile: "Perfil público",
        profileDesc:
          "Cree su perfil público y elija el contenido que le interese seguir.",
        subscriptions: "Suscripciones",
        subscriptionsDesc: "Gestione sus suscripciones.",
        support: "Soporte",
        supportDesc: "Obtenga asistencia sobre los productos de Red Hat.",
        training: "Capacitación y certificación",
        trainingDesc:
          "Acceda a la Red Hat Learning Subscription, los cursos y los exámenes.",
        userManagement: "Gestión de usuarios",
        userManagementDesc: "Gestione las cuentas de usuario de su empresa.",
      },
      pt: {
        accountDetails: "Informações sobre a conta",
        accountDetailsDesc:
          "Edite suas informações de contato, senha, preferências de localização e notificações de errata.",
        accountNumber: "Account number",
        accountTeam: "Account team",
        accountTeamDesc: "Obtenha ajuda do seu time de contas da Red Hat.",
        avatarEdit: "Editar avatar",
        login: "Login",
        logout: "Sair",
        orgAdmin: "Administrador da organização",
        profile: "Perfil da comunidade",
        profileDesc:
          "Complete seu perfil público e controle o conteúdo que você quer seguir.",
        subscriptions: "Subscrições",
        subscriptionsDesc: "Gerencie suas subscrições.",
        support: "Suporte",
        supportDesc: "Obtenha suporte para suas soluções Red Hat.",
        training: "Treinamento e certificação",
        trainingDesc:
          "Acesse sua conta no Red Hat Learning Subscription e veja seus cursos e exames.",
        userManagement: "Gerenciamento de usuários",
        userManagementDesc: "Gerencie os usuários da sua organização.",
      },
    };

    // Ensure 'this' is tied to the component object in these member functions
    this._updateAvatarSrc = this._updateAvatarSrc.bind(this);
    this._createAccountDropdown = this._createAccountDropdown.bind(this);
    this._processUserReady = this._processUserReady.bind(this);
    this._processUserData = this._processUserData.bind(this);
    this._shadowDomInteraction = this._shadowDomInteraction.bind(this);
    this._handleLanguageChange = this._handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.dropdownWrapper = this.shadowRoot.getElementById("wrapper");

    // Watch for user info events
    const bodyTag = document.querySelector("body");
    bodyTag.addEventListener("user-ready", this._processUserReady);
    bodyTag.addEventListener("user-update", this._processUserReady);

    this.emitEvent(RHAccountDropdown.events.ready, {
      detail: {
        component: this,
      },
    });
  }

  disconnectedCallback() {
    const bodyTag = document.querySelector("body");
    bodyTag.removeEventListener("user-ready", this._processUserReady);
    bodyTag.removeEventListener("user-update", this._processUserReady);
    if (this.dropdownWrapper) {
      this.dropdownWrapper.removeEventListener(
        "click",
        this._shadowDomInteraction
      );
    }
  }

  /**
   * Handle change in language
   */
  _handleLanguageChange() {
    // Re-render account dropdown with new language
    this._createAccountDropdown(this._userData);
  }

  /**
   * Event handler to capture interactions that occur in the shadow DOM
   * @param {object} event
   */
  _shadowDomInteraction(event) {
    if (!window.ShadyCSS || window.ShadyCSS.nativeShadow) {
      this.emitEvent(RHAccountDropdown.events.shadowDomInteraction, {
        detail: {
          target: event.target,
          parent: this,
        },
      });
    }
  }

  /**
   * Creates Avatar Markup
   * @param {string} name User's Name
   * @param {string} src Optional, Path to avatar image
   */
  _createPfeAvatar(name, src) {
    const pfeAvatar = document.createElement(`pfe-avatar`);
    pfeAvatar.setAttribute("name", name);
    pfeAvatar.setAttribute("shape", "circle");

    if (typeof src === "string") {
      pfeAvatar.setAttribute("src", src);
    }

    return pfeAvatar;
  }

  /**
   * Get a user's full name from userData or construct it and add it to userData
   * @param {object} userData
   * @return {string} User's full name
   */
  _getFullName(userData) {
    if (typeof userData.fullName === "string") {
      return userData.fullName;
    }
    let fullName = "";
    // Create Name based on first and last name
    if (typeof userData.firstName === "string") {
      fullName = userData.firstName;
    }
    if (typeof userData.lastName === "string") {
      if (fullName.length) {
        fullName = `${fullName} ${userData.lastName}`;
      } else {
        fullName = userData.lastName;
      }
    }
    if (!fullName.length) {
      this.error("Couldn't get full name");
    }
    this.setAttribute("full-name", fullName);
    return fullName;
  }

  /**
   * Fetch avatar image from API and update all avatar elements
   * @param {string} REDHAT_LOGIN The value of REDHAT_LOGIN from userData
   */
  _updateAvatarSrc(REDHAT_LOGIN) {
    // Don't bother getting avatar if browser doesn't support fetch
    if (typeof fetch === "undefined") {
      return;
    }

    // If REDHAT_LOGIN exists but hasn't changed, there's no reason to fetch a new avatar
    if (
      this._userData === null ||
      (typeof this._userData.REDHAT_LOGIN === "string" &&
        REDHAT_LOGIN !== this._userData.REDHAT_LOGIN)
    ) {
      let avatarEndpoint = "//access.redhat.com/api/users/avatar/";

      fetch(`${avatarEndpoint}${REDHAT_LOGIN}`, { mode: "cors" })
        .then((response) => {
          if (
            typeof response === "object" &&
            typeof response.url === "string" &&
            response.url.substr(0, 26) === "https://access.redhat.com/" &&
            !response.url.includes("blank.png")
          ) {
            // Update the component attribute
            this.setAttribute("avatar-url", response.url);
            // We have a valid avatar src, update all avatars
            for (let index = 0; index < this._avatarElements.length; index++) {
              this._avatarElements[index].setAttribute("src", response.url);
            }
          }
        })
        .catch((error) => this.warn(error));
    }
  }

  /**
   * Creates HTML for icon in a secondary link
   * @param {string} icon Name of icon from pfe-icon
   * @return {object} DOM Object for pfe-icon
   */
  _createPfeIcon(icon) {
    const iconElement = document.createElement("pfe-icon");
    iconElement.setAttribute("icon", icon);
    iconElement.setAttribute("size", "sm");
    iconElement.setAttribute("aria-hidden", "true");
    return iconElement;
  }

  /**
   * Creates Account Dropdown markup
   * @param {object} userData
   * @return {object} Reference to the dropdownOuterWrapper
   */
  _createAccountDropdown(userData = this._userData) {
    if (!userData) {
      return;
    }
    const linkEnv = this.environment === null ? "" : "." + this.environment;

    this.log(
      `Creating account dropdown content with env="${linkEnv}" and lang="${this.lang}"`
    );

    const dropdownWrapper = document.createElement("div");
    dropdownWrapper.id = "wrapper";
    dropdownWrapper.classList.add("pfe-navigation__dropdown");

    // Add class to scope styles for old browsers like IE11
    if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
      dropdownWrapper.classList.add("rh-account-dropdown--in-crusty-browser");
    }

    // Create basic info
    // @todo: check to see if having an H3 in the navigation causes an
    // accessibility issue with headings not being in sequential order
    const basicInfoWrapper = document.createElement("h3");
    const fullName = this._getFullName(userData);
    const basicInfoAvatar = this._createPfeAvatar(fullName);

    basicInfoWrapper.classList.add("user-info");

    this._avatarElements.push(basicInfoAvatar);
    basicInfoAvatar.classList.add("user-info__avatar");

    const basicInfoName = document.createElement("div");
    basicInfoName.classList.add("user-info__full-name");
    basicInfoName.innerText = fullName;

    const editAvatarLink = document.createElement("a");
    editAvatarLink.setAttribute(
      "href",
      `https://access${linkEnv}.redhat.com/user/edit`
    );
    editAvatarLink.classList.add("user-info__edit-avatar");
    editAvatarLink.innerText = this._navTranslations[this._lang].avatarEdit;
    editAvatarLink.dataset.analyticsText =
      this._navTranslations["en"].avatarEdit;

    // @note Hardcoding this icon to avoid issues adding icon sets to pfe-icon
    const pencilIcon = `<svg fill="currentColor" height="100%" width="100%" viewBox="0 0 512 512" aria-hidden="true" role="img" style="vertical-align: -0.125em;" xmlns="http://www.w3.org/2000/svg"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" transform=""></path></svg>`;
    editAvatarLink.innerHTML = `${pencilIcon}${editAvatarLink.innerHTML}`;

    basicInfoWrapper.appendChild(basicInfoAvatar);
    basicInfoWrapper.appendChild(basicInfoName);
    basicInfoWrapper.appendChild(editAvatarLink);

    // Create linklist
    // @link https://docs.google.com/spreadsheets/d/1CK6s_-SWBkRIKyDJHoqPL7ygfrVxKEiOM3oZ-UswgIE/edit#gid=0
    // @link https://docs.google.com/document/d/1JkgrzU1dXQxh28EFKfwtGH2dNwVJEGvDzQGG4nUGiDs/edit#
    const defaultLinks = [
      // Column 1
      [
        {
          text: this._navTranslations[this._lang].accountDetails,
          url: `https://www${linkEnv}.redhat.com/wapps/ugc/protected/personalInfo.html`,
          description: this._navTranslations[this._lang].accountDetailsDesc,
          data: {
            analyticsText: this._navTranslations.en.accountDetails,
          },
        },
        {
          text: this._navTranslations[this._lang].profile,
          url: `https://access${linkEnv}.redhat.com/user`,
          description: this._navTranslations[this._lang].profileDesc,
          data: {
            analyticsText: this._navTranslations.en.profile,
          },
        },
        {
          text: this._navTranslations[this._lang].training,
          url: `https://rol${linkEnv}.redhat.com/rol/app/`,
          description: this._navTranslations[this._lang].trainingDesc,
          data: {
            analyticsText: this._navTranslations.en.training,
          },
        },
      ],
      // Column 2
      [
        {
          text: this._navTranslations[this._lang].subscriptions,
          url: `https://access${linkEnv}.redhat.com/management`,
          description: this._navTranslations[this._lang].subscriptionsDesc,
          data: {
            analyticsText: this._navTranslations.en.subscriptions,
          },
          // Should respect "Manage subs permission"
          requiresRole: "portal_manage_subscriptions",
        },
        {
          text: this._navTranslations[this._lang].accountTeam,
          url: `https://access${linkEnv}.redhat.com/account-team`,
          description: this._navTranslations[this._lang].accountTeamDesc,
          data: {
            analyticsText: this._navTranslations.en.accountTeam,
          },
        },
        {
          text: this._navTranslations[this._lang].userManagement,
          url: `https://www${linkEnv}.redhat.com/wapps/ugc/protected/usermgt/userList.html`,
          description: this._navTranslations[this._lang].userManagementDesc,
          data: {
            analyticsText: this._navTranslations.en.userManagement,
          },
          // Should respect "is Org Admin"
          requiresRole: "admin:org:all",
        },
        {
          text: this._navTranslations[this._lang].support,
          url: `https://access${linkEnv}.redhat.com/support/cases/#/troubleshoot/`,
          description: this._navTranslations[this._lang].supportDesc,
          data: {
            analyticsText: this._navTranslations.en.support,
          },
        },
        // {
        //   text: '',
        //   url: '',
        //   description: '',
        // },
      ],
    ];

    // Build Account Dropdown content
    const accountLinksWrapper = document.createElement("div");
    accountLinksWrapper.classList.add("account-links");
    accountLinksWrapper.setAttribute(
      "aria-label",
      this._navTranslations[this._lang].userManagement
    );

    // Iterate over column arrays of content
    for (let index = 0; index < defaultLinks.length; index++) {
      const column = defaultLinks[index];
      const accountLinksColumn = document.createElement("ul");
      accountLinksColumn.classList.add("account-links__column");

      // Iterate over each column
      for (let j = 0; j < column.length; j++) {
        const linkData = column[j];

        // Figure out if user has access
        let hasAccess = false;
        if (typeof linkData.requiresRole === "undefined") {
          // Link doesn't require a role
          hasAccess = true;
        } else if (
          typeof userData === "object" &&
          typeof userData.realm_access === "object" &&
          userData.realm_access.roles &&
          Array.isArray(userData.realm_access.roles) &&
          userData.realm_access.roles.includes(linkData.requiresRole)
        ) {
          hasAccess = true;
        }

        if (hasAccess) {
          const linkWrapper = document.createElement("li");
          const link = document.createElement("a");

          link.setAttribute("href", linkData.url);

          // Setting data attributes on link
          const linkDataAttributes = Object.keys(linkData.data);
          for (let k = 0; k < linkDataAttributes.length; k++) {
            const dataAttributeName = linkDataAttributes[k];
            const dataAttributeValue = linkData.data[dataAttributeName];
            link.dataset[dataAttributeName] = dataAttributeValue;
          }

          // Build the HTML
          link.innerHTML = `
            <div class="account-link__title">
              ${linkData.text}
            </div>`;

          if (linkData.description) {
            link.innerHTML = `${link.innerHTML}
              <div class="account-link__description">
                ${linkData.description}
              </div>`;
          }

          linkWrapper.appendChild(link);
          accountLinksColumn.appendChild(linkWrapper);
        }
      }
      accountLinksWrapper.appendChild(accountLinksColumn);
    }

    // Create account metadata content
    const accountMetadataWrapper = document.createElement("div");
    accountMetadataWrapper.classList.add("account-metadata");

    const accountLoginNameWrapper = document.createElement("h3");
    accountLoginNameWrapper.classList.add("account-metadata__login-name");
    accountLoginNameWrapper.innerText = `${
      this._navTranslations[this._lang].login
    }: ${userData.REDHAT_LOGIN}`;

    // @todo Company name?

    const accountNumberWrapper = document.createElement("div");
    accountNumberWrapper.classList.add("account-metadata__account-number");

    // Some accounts don't have account numbers
    if (userData.account_number && userData.account_number.trim().length) {
      accountNumberWrapper.innerText = `${
        this._navTranslations[this._lang].accountNumber
      }: ${userData.account_number}`;
    }

    const accountEmailWrapper = document.createElement("div");
    accountEmailWrapper.classList.add("account-metadata__email");
    accountEmailWrapper.innerText = userData.email;

    const logOutWrapper = document.createElement("div");
    logOutWrapper.classList.add("account-metadata__logout-wrapper");
    const logoutLink = document.createElement("a");
    if (this.hasAttribute("logout-link")) {
      logoutLink.setAttribute("href", this.logoutLink);
    } else {
      this.error("Couldn't get logout link");
    }

    if (logoutLink.hasAttribute("href")) {
      logoutLink.innerText = this._navTranslations[this._lang].logout;
      logoutLink.dataset.analyticsText = this._navTranslations["en"].logout;
      logOutWrapper.appendChild(logoutLink);
    }

    // Add account metadata content to wrapper
    accountMetadataWrapper.appendChild(accountLoginNameWrapper);
    // Add org admin if they are one
    if (
      typeof userData === "object" &&
      typeof userData.realm_access === "object" &&
      userData.realm_access.roles &&
      Array.isArray(userData.realm_access.roles) &&
      userData.realm_access.roles.includes("admin:org:all")
    ) {
      const orgAdmin = document.createElement("div");
      orgAdmin.classList.add("account-metadata__org-admin");
      orgAdmin.innerText = this._navTranslations[this._lang].orgAdmin;
      accountMetadataWrapper.classList.add("account-metadata--org-admin");
      accountMetadataWrapper.appendChild(orgAdmin);
    }
    accountMetadataWrapper.appendChild(accountNumberWrapper);
    accountMetadataWrapper.appendChild(accountEmailWrapper);

    // Duplicate account metadata for mobile layout, without logout button
    const mobileAccountMetadataWrapper = accountMetadataWrapper.cloneNode(true);
    mobileAccountMetadataWrapper.classList.add("account-metadata--mobile");

    // Add logout button
    accountMetadataWrapper.appendChild(logOutWrapper);

    // Add account dropdown content
    dropdownWrapper.appendChild(basicInfoWrapper);
    dropdownWrapper.appendChild(mobileAccountMetadataWrapper);
    dropdownWrapper.appendChild(accountLinksWrapper);
    dropdownWrapper.appendChild(accountMetadataWrapper);

    dropdownWrapper.addEventListener("click", this._shadowDomInteraction);

    // Replace dropdown contents
    this.dropdownWrapper.removeEventListener(
      "click",
      this._shadowDomInteraction
    );

    // @note IE compatability: there's a parent div in the shadow DOM that is only needed
    // becuase IE doesn't support .replace()
    this.dropdownWrapper.parentElement.replaceChild(
      dropdownWrapper,
      this.dropdownWrapper
    );

    // Set pointer to new dropdownWrapper
    this.dropdownWrapper = dropdownWrapper;

    return dropdownWrapper;
  }

  /**
   * Parse User Data an make updates to appropriate bits
   * @param {object} userData Keycloak token as an object
   */
  _processUserData(userData) {
    // Create full name
    userData.fullName = this._getFullName(userData);
    // Update the full name attribute, if neccesary (triggers process in pfe-navigation)
    if (this.fullName !== userData.fullName) {
      this.setAttribute("full-name", userData.fullName);
    }

    // Initialize Account Dropdown if we don't have old userData
    if (this._userData === null) {
      this._createAccountDropdown(userData);
    }
    // @todo Update existing elements where necessary
    // else {
    // }

    if (typeof userData.REDHAT_LOGIN === "string") {
      this._updateAvatarSrc(userData.REDHAT_LOGIN);
    } else {
      this.error("Could not find Red Hat Login");
    }

    this._userData = userData;
  }

  /**
   * Process data from user-ready or user-update from cpx-user
   * @param {object} event Event's object
   */
  _processUserReady(event) {
    // Expecting this event from cpxUser component
    const cpxUser = event.target;

    if (cpxUser.user && typeof cpxUser.user === "object") {
      this._processUserData(cpxUser.user);
    }
  }
}

PFElement.create(RHAccountDropdown);

export default RHAccountDropdown;
