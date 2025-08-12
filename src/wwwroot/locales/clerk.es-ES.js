(function () {
  'use strict';
  if (window && !window.Clerk) {
    window.Clerk = {};
  }
  if (window && window.Clerk && !window.Clerk.localizations) {
    window.Clerk.localizations = {};
  }
  window.Clerk.localizations.es = {
    locale: "es-ES",
    apiKeys: {
      action__add: void 0,
      action__search: void 0,
      createdAndExpirationStatus__expiresOn: void 0,
      createdAndExpirationStatus__never: void 0,
      detailsTitle__emptyRow: void 0,
      formButtonPrimary__add: void 0,
      formFieldCaption__expiration__expiresOn: void 0,
      formFieldCaption__expiration__never: void 0,
      formFieldOption__expiration__180d: void 0,
      formFieldOption__expiration__1d: void 0,
      formFieldOption__expiration__1y: void 0,
      formFieldOption__expiration__30d: void 0,
      formFieldOption__expiration__60d: void 0,
      formFieldOption__expiration__7d: void 0,
      formFieldOption__expiration__90d: void 0,
      formFieldOption__expiration__never: void 0,
      formHint: void 0,
      formTitle: void 0,
      lastUsed__days: void 0,
      lastUsed__hours: void 0,
      lastUsed__minutes: void 0,
      lastUsed__months: void 0,
      lastUsed__seconds: void 0,
      lastUsed__years: void 0,
      menuAction__revoke: void 0,
      revokeConfirmation: {
        confirmationText: void 0,
        formButtonPrimary__revoke: void 0,
        formHint: void 0,
        formTitle: void 0
      }
    },
    backButton: "Atr\xE1s",
    badge__activePlan: void 0,
    badge__canceledEndsAt: void 0,
    badge__currentPlan: void 0,
    badge__default: "Por defecto",
    badge__endsAt: void 0,
    badge__expired: void 0,
    badge__otherImpersonatorDevice: "Otro dispositivo de imitaci\xF3n",
    badge__pastDueAt: void 0,
    badge__pastDuePlan: void 0,
    badge__primary: "Primario",
    badge__renewsAt: void 0,
    badge__requiresAction: "Requiere acci\xF3n",
    badge__startsAt: void 0,
    badge__thisDevice: "Este dispositivo",
    badge__unverified: "No confirmado",
    badge__upcomingPlan: void 0,
    badge__userDevice: "Dispositivo de usuario",
    badge__you: "Usted",
    commerce: {
      addPaymentMethod: void 0,
      alwaysFree: void 0,
      annually: void 0,
      availableFeatures: void 0,
      billedAnnually: void 0,
      billedMonthlyOnly: void 0,
      cancelSubscription: void 0,
      cancelSubscriptionAccessUntil: void 0,
      cancelSubscriptionNoCharge: void 0,
      cancelSubscriptionTitle: void 0,
      cannotSubscribeMonthly: void 0,
      cannotSubscribeUnrecoverable: void 0,
      checkout: {
        description__paymentSuccessful: void 0,
        description__subscriptionSuccessful: void 0,
        downgradeNotice: void 0,
        emailForm: {
          subtitle: void 0,
          title: void 0
        },
        lineItems: {
          title__paymentMethod: void 0,
          title__statementId: void 0,
          title__subscriptionBegins: void 0,
          title__totalPaid: void 0
        },
        pastDueNotice: void 0,
        perMonth: void 0,
        title: void 0,
        title__paymentSuccessful: void 0,
        title__subscriptionSuccessful: void 0
      },
      credit: void 0,
      creditRemainder: void 0,
      defaultFreePlanActive: void 0,
      free: void 0,
      getStarted: void 0,
      keepSubscription: void 0,
      manage: void 0,
      manageSubscription: void 0,
      month: void 0,
      monthly: void 0,
      pastDue: void 0,
      pay: void 0,
      paymentMethods: void 0,
      paymentSource: {
        applePayDescription: {
          annual: void 0,
          monthly: void 0
        },
        dev: {
          anyNumbers: void 0,
          cardNumber: void 0,
          cvcZip: void 0,
          developmentMode: void 0,
          expirationDate: void 0,
          testCardInfo: void 0
        }
      },
      popular: void 0,
      pricingTable: {
        billingCycle: void 0,
        included: void 0
      },
      reSubscribe: void 0,
      seeAllFeatures: void 0,
      subscribe: void 0,
      subscriptionDetails: {
        beginsOn: void 0,
        currentBillingCycle: void 0,
        endsOn: void 0,
        nextPaymentAmount: void 0,
        nextPaymentOn: void 0,
        pastDueAt: void 0,
        renewsAt: void 0,
        subscribedOn: void 0,
        title: void 0
      },
      subtotal: void 0,
      switchPlan: void 0,
      switchToAnnual: void 0,
      switchToAnnualWithAnnualPrice: void 0,
      switchToMonthly: void 0,
      switchToMonthlyWithPrice: void 0,
      totalDue: void 0,
      totalDueToday: void 0,
      viewFeatures: void 0,
      viewPayment: void 0,
      year: void 0
    },
    createOrganization: {
      formButtonSubmit: "Crear organizaci\xF3n",
      invitePage: {
        formButtonReset: "Saltar"
      },
      title: "Crear organizaci\xF3n"
    },
    dates: {
      lastDay: "Ayer a las {{ date | timeString('es-ES') }}",
      next6Days: "{{ date | weekday('es-ES','long') }} a las {{ date | timeString('es-ES') }}",
      nextDay: "Ma\xF1ana a las {{ date | timeString('es-ES') }}",
      numeric: "{{ date | numeric('es-ES') }}",
      previous6Days: "\xDAltimo {{ date | weekday('es-ES','long') }} en {{ date | timeString('es-ES') }}",
      sameDay: "Hoy a las {{ date | timeString('es-ES') }}"
    },
    dividerText: "o",
    footerActionLink__alternativePhoneCodeProvider: void 0,
    footerActionLink__useAnotherMethod: "Usar otro m\xE9todo",
    footerPageLink__help: "Ayuda",
    footerPageLink__privacy: "Privacidad",
    footerPageLink__terms: "T\xE9rminos",
    formButtonPrimary: "Continuar",
    formButtonPrimary__verify: "Verificar",
    formFieldAction__forgotPassword: "Has olvidado tu contrase\xF1a?",
    formFieldError__matchingPasswords: "Las contrase\xF1as coinciden.",
    formFieldError__notMatchingPasswords: "Las contrase\xF1as no coinciden.",
    formFieldError__verificationLinkExpired: "El enlace de verificaci\xF3n ha expirado. Por favor solicite uno nuevo.",
    formFieldHintText__optional: "Opcional",
    formFieldHintText__slug: "Un slug es un ID legible que debe ser \xFAnico. Es com\xFAnmente usado en URLs.",
    formFieldInputPlaceholder__apiKeyDescription: void 0,
    formFieldInputPlaceholder__apiKeyExpirationDate: void 0,
    formFieldInputPlaceholder__apiKeyName: void 0,
    formFieldInputPlaceholder__backupCode: "Ingrese su c\xF3digo de respaldo",
    formFieldInputPlaceholder__confirmDeletionUserAccount: "Eliminar cuenta",
    formFieldInputPlaceholder__emailAddress: "Ingrese su direcci\xF3n de correo electr\xF3nico",
    formFieldInputPlaceholder__emailAddress_username: "Ingrese su correo electr\xF3nico o nombre de usuario",
    formFieldInputPlaceholder__emailAddresses: "Ingrese o pegue una o m\xE1s direcciones de correo electr\xF3nico, separadas por espacios o comas",
    formFieldInputPlaceholder__firstName: "Ingrese su nombre",
    formFieldInputPlaceholder__lastName: "Ingrese su apellido",
    formFieldInputPlaceholder__organizationDomain: "Ingrese el dominio de la organizaci\xF3n",
    formFieldInputPlaceholder__organizationDomainEmailAddress: "Ingrese un correo electr\xF3nico del dominio",
    formFieldInputPlaceholder__organizationName: "Ingrese el nombre de la organizaci\xF3n",
    formFieldInputPlaceholder__organizationSlug: "Ingrese un slug \xFAnico para la organizaci\xF3n",
    formFieldInputPlaceholder__password: "Ingrese su contrase\xF1a",
    formFieldInputPlaceholder__phoneNumber: "Ingrese su n\xFAmero telef\xF3nico",
    formFieldInputPlaceholder__username: "Ingrese su nombre de usuario",
    formFieldLabel__apiKeyDescription: void 0,
    formFieldLabel__apiKeyExpiration: void 0,
    formFieldLabel__apiKeyName: void 0,
    formFieldLabel__automaticInvitations: "Activar invitaciones autom\xE1ticas para este dominio",
    formFieldLabel__backupCode: "C\xF3digo de respaldo",
    formFieldLabel__confirmDeletion: "Confirmaci\xF3n",
    formFieldLabel__confirmPassword: "Confirme la contrase\xF1a",
    formFieldLabel__currentPassword: "Contrase\xF1a actual",
    formFieldLabel__emailAddress: "Correo electr\xF3nico",
    formFieldLabel__emailAddress_username: "Correo electr\xF3nico o nombre de usuario",
    formFieldLabel__emailAddresses: "Direcciones de correo",
    formFieldLabel__firstName: "Nombre",
    formFieldLabel__lastName: "Apellido",
    formFieldLabel__newPassword: "Nueva contrase\xF1a",
    formFieldLabel__organizationDomain: "Dominio",
    formFieldLabel__organizationDomainDeletePending: "Borrar invitaciones y sugerencias pendientes",
    formFieldLabel__organizationDomainEmailAddress: "Correo de verificaci\xF3n",
    formFieldLabel__organizationDomainEmailAddressDescription: "Ingrese una direcci\xF3n de correo electr\xF3nico bajo este dominio para recibir un c\xF3digo y verificarlo.",
    formFieldLabel__organizationName: "Nombre de la Organizaci\xF3n",
    formFieldLabel__organizationSlug: "Slug",
    formFieldLabel__passkeyName: "Nombre de la clave de acceso",
    formFieldLabel__password: "Contrase\xF1a",
    formFieldLabel__phoneNumber: "N\xFAmero telef\xF3nico",
    formFieldLabel__role: "Rol",
    formFieldLabel__signOutOfOtherSessions: "Cerrar sesi\xF3n en todos los dem\xE1s dispositivos",
    formFieldLabel__username: "Nombre de usuario",
    impersonationFab: {
      action__signOut: "Cerrar",
      title: "Registrado como {{identifier}}"
    },
    maintenanceMode: "Modo de mantenimiento",
    membershipRole__admin: "Administrador",
    membershipRole__basicMember: "Miembro",
    membershipRole__guestMember: "Invitado",
    organizationList: {
      action__createOrganization: "Crear organizaci\xF3n",
      action__invitationAccept: "Unirse",
      action__suggestionsAccept: "Solicitud a unirse",
      createOrganization: "Crear Organizaci\xF3n",
      invitationAcceptedLabel: "Unido",
      subtitle: "para continuar a {{applicationName}}",
      suggestionsAcceptedLabel: "Aprobaci\xF3n pendiente",
      title: "Choose an account",
      titleWithoutPersonal: "Escoja una organizaci\xF3n"
    },
    organizationProfile: {
      apiKeysPage: {
        title: void 0
      },
      badge__automaticInvitation: "Invitaciones autom\xE1ticas",
      badge__automaticSuggestion: "Sugerencias autom\xE1ticas",
      badge__manualInvitation: "Sin inscripci\xF3n autom\xE1tica",
      badge__unverified: "No verificado",
      billingPage: {
        paymentHistorySection: {
          empty: void 0,
          notFound: void 0,
          tableHeader__amount: void 0,
          tableHeader__date: void 0,
          tableHeader__status: void 0
        },
        paymentSourcesSection: {
          actionLabel__default: void 0,
          actionLabel__remove: void 0,
          add: void 0,
          addSubtitle: void 0,
          cancelButton: void 0,
          formButtonPrimary__add: void 0,
          formButtonPrimary__pay: void 0,
          payWithTestCardButton: void 0,
          removeResource: {
            messageLine1: void 0,
            messageLine2: void 0,
            successMessage: void 0,
            title: void 0
          },
          title: void 0
        },
        start: {
          headerTitle__payments: void 0,
          headerTitle__plans: void 0,
          headerTitle__statements: void 0,
          headerTitle__subscriptions: void 0
        },
        statementsSection: {
          empty: void 0,
          itemCaption__paidForPlan: void 0,
          itemCaption__proratedCredit: void 0,
          itemCaption__subscribedAndPaidForPlan: void 0,
          notFound: void 0,
          tableHeader__amount: void 0,
          tableHeader__date: void 0,
          title: void 0,
          totalPaid: void 0
        },
        subscriptionsListSection: {
          actionLabel__newSubscription: void 0,
          actionLabel__switchPlan: void 0,
          tableHeader__edit: void 0,
          tableHeader__plan: void 0,
          tableHeader__startDate: void 0,
          title: void 0
        },
        subscriptionsSection: {
          actionLabel__default: void 0
        },
        switchPlansSection: {
          title: void 0
        },
        title: void 0
      },
      createDomainPage: {
        subtitle: "Agregue el dominio para verificar. Los usuarios con direcciones de correo electr\xF3nico en este dominio pueden unirse a la organizaci\xF3n autom\xE1ticamente o solicitar unirse.",
        title: "Agregar dominio"
      },
      invitePage: {
        detailsTitle__inviteFailed: "No se pudieron enviar las invitaciones. Solucione lo siguiente y vuelva a intentarlo:",
        formButtonPrimary__continue: "Enviar invitaciones",
        selectDropdown__role: "Seleccionar rol",
        subtitle: "Invitar nuevos miembros a esta organizaci\xF3n",
        successMessage: "Invitaciones enviadas con \xE9xito",
        title: "Invitar miembros"
      },
      membersPage: {
        action__invite: "Invitar",
        action__search: "Buscar",
        activeMembersTab: {
          menuAction__remove: "Quitar miembro",
          tableHeader__actions: "Acciones",
          tableHeader__joined: "Unido",
          tableHeader__role: "Rol",
          tableHeader__user: "Usuario"
        },
        detailsTitle__emptyRow: "No hay miembros para mostrar",
        invitationsTab: {
          autoInvitations: {
            headerSubtitle: "Invite a usuarios conectando un dominio de correo electr\xF3nico con su organizaci\xF3n. Cualquiera que se registre con un dominio de correo electr\xF3nico coincidente podr\xE1 unirse a la organizaci\xF3n en cualquier momento.",
            headerTitle: "Invitaciones autom\xE1ticas",
            primaryButton: "Gestionar dominios verificados"
          },
          table__emptyRow: "Sin invitaciones para mostrar"
        },
        invitedMembersTab: {
          menuAction__revoke: "Revocar invitaci\xF3n",
          tableHeader__invited: "Invitado"
        },
        requestsTab: {
          autoSuggestions: {
            headerSubtitle: "Los usuarios que se registren con un dominio de correo electr\xF3nico coincidente podr\xE1n ver una sugerencia para solicitar unirse a su organizaci\xF3n.",
            headerTitle: "Sugerencias autom\xE1ticas",
            primaryButton: "Gestionar dominios verificados"
          },
          menuAction__approve: "Aprobar",
          menuAction__reject: "Rechazar",
          tableHeader__requested: "Acceso solicitado",
          table__emptyRow: "Sin solicitudes para mostrar"
        },
        start: {
          headerTitle__invitations: "Invitaciones",
          headerTitle__members: "Miembros",
          headerTitle__requests: "Solicitudes"
        }
      },
      navbar: {
        apiKeys: void 0,
        billing: void 0,
        description: "Gestione su organizaci\xF3n.",
        general: "General",
        members: "Miembros",
        title: "Organizaci\xF3n"
      },
      plansPage: {
        alerts: {
          noPermissionsToManageBilling: void 0
        },
        title: void 0
      },
      profilePage: {
        dangerSection: {
          deleteOrganization: {
            actionDescription: 'Escriba "{{organizationName}}" a continuaci\xF3n para continuar.',
            messageLine1: "\xBFEst\xE1 seguro de que desea eliminar esta organizaci\xF3n?",
            messageLine2: "Esta acci\xF3n es permanente e irreversible.",
            successMessage: "Ha eliminado la organizaci\xF3n.",
            title: "Borrar organizaci\xF3n"
          },
          leaveOrganization: {
            actionDescription: 'Escriba "{{organizationName}}" a continuaci\xF3n para continuar.',
            messageLine1: "\xBFEst\xE1 seguro de que desea abandonar esta organizaci\xF3n? Perder\xE1 el acceso a esta organizaci\xF3n y sus aplicaciones.",
            messageLine2: "Esta acci\xF3n es permanente e irreversible.",
            successMessage: "Has dejado la organizaci\xF3n.",
            title: "Abandonar la organizaci\xF3n"
          },
          title: "Peligro"
        },
        domainSection: {
          menuAction__manage: "Gestione",
          menuAction__remove: "Eliminar",
          menuAction__verify: "Verificar",
          primaryButton: "A\xF1adir dominio",
          subtitle: "Permita que los usuarios se unan a la organizaci\xF3n autom\xE1ticamente o soliciten unirse bas\xE1ndose en un dominio de correo electr\xF3nico verificado.",
          title: "Dominios verificados"
        },
        successMessage: "La organizaci\xF3n ha sido actualizada.",
        title: "Perfil de la organizaci\xF3n"
      },
      removeDomainPage: {
        messageLine1: "Se eliminar\xE1 el dominio de correo electr\xF3nico {{domain}}.",
        messageLine2: "Los usuarios no podr\xE1n unirse a la organizaci\xF3n autom\xE1ticamente despu\xE9s de esto.",
        successMessage: "{{dominio}} ha sido eliminado.",
        title: "Eliminar dominio"
      },
      start: {
        headerTitle__general: "General",
        headerTitle__members: "Miembros",
        profileSection: {
          primaryButton: "Actualizar perfil",
          title: "Perfil de la Organizaci\xF3n",
          uploadAction__title: "Logo"
        }
      },
      verifiedDomainPage: {
        dangerTab: {
          calloutInfoLabel: "La eliminaci\xF3n de este dominio afectar\xE1 a los usuarios invitados.",
          removeDomainActionLabel__remove: "Eliminar dominio",
          removeDomainSubtitle: "Elimine este dominio de sus dominios verificados",
          removeDomainTitle: "Eliminar dominio"
        },
        enrollmentTab: {
          automaticInvitationOption__description: "Los usuarios son invitados autom\xE1ticamente a unirse a la organizaci\xF3n cuando se registran y pueden unirse en cualquier momento.",
          automaticInvitationOption__label: "Invitaciones autom\xE1ticas",
          automaticSuggestionOption__description: "Los usuarios reciben una sugerencia para solicitar unirse, pero deben ser aprobados por un administrador antes de poder unirse a la organizaci\xF3n.",
          automaticSuggestionOption__label: "Sugerencias autom\xE1ticas",
          calloutInfoLabel: "Cambiar el modo de inscripci\xF3n solo afectar\xE1 a nuevos usuarios.",
          calloutInvitationCountLabel: "Invitaciones pendientes enviadas a los usuarios: {{count}}",
          calloutSuggestionCountLabel: "Sugerencias pendientes enviadas a los usuarios: {{count}}",
          manualInvitationOption__description: "Los usuarios solo pueden ser invitados manualmente a la organizaci\xF3n.",
          manualInvitationOption__label: "Sin inscripci\xF3n autom\xE1tica",
          subtitle: "Elija c\xF3mo los usuarios de este dominio pueden unirse a la organizaci\xF3n."
        },
        start: {
          headerTitle__danger: "Peligro",
          headerTitle__enrollment: "Opciones de inscripci\xF3n"
        },
        subtitle: "El dominio {{domain}} est\xE1 ahora verificado. Contin\xFAe seleccionando el modo de inscripci\xF3n.",
        title: "Actualizar {{domain}}"
      },
      verifyDomainPage: {
        formSubtitle: "Ingrese el c\xF3digo de verificaci\xF3n enviado a su direcci\xF3n de correo electr\xF3nico",
        formTitle: "C\xF3digo de verificaci\xF3n",
        resendButton: "\xBFNo recibi\xF3 un c\xF3digo? Reenviar",
        subtitle: "El dominio {{domainName}} necesita ser verificado por correo electr\xF3nico.",
        subtitleVerificationCodeScreen: "Se envi\xF3 un c\xF3digo de verificaci\xF3n a {{emailAddress}}. Ingrese el c\xF3digo para continuar.",
        title: "Verificar dominio"
      }
    },
    organizationSwitcher: {
      action__createOrganization: "Crear Organizaci\xF3n",
      action__invitationAccept: "Unirse",
      action__manageOrganization: "Administrar Organizaci\xF3n",
      action__suggestionsAccept: "Solicitar unirse",
      notSelected: "Ninguna organizaci\xF3n seleccionada",
      personalWorkspace: "Espacio de trabajo personal",
      suggestionsAcceptedLabel: "Aprobaci\xF3n pendiente"
    },
    paginationButton__next: "Pr\xF3ximo",
    paginationButton__previous: "Previo",
    paginationRowText__displaying: "Mostrando",
    paginationRowText__of: "de",
    reverification: {
      alternativeMethods: {
        actionLink: "Probar otro m\xE9todo",
        actionText: "\xBFNo tienes acceso a este m\xE9todo? Prueba otra opci\xF3n.",
        blockButton__backupCode: "Usar c\xF3digo de respaldo",
        blockButton__emailCode: "Usar c\xF3digo de correo electr\xF3nico",
        blockButton__passkey: void 0,
        blockButton__password: "Usar contrase\xF1a",
        blockButton__phoneCode: "Usar c\xF3digo de tel\xE9fono",
        blockButton__totp: "Usar verificaci\xF3n TOTP",
        getHelp: {
          blockButton__emailSupport: "Contactar soporte por correo electr\xF3nico",
          content: "Si no puedes verificar tu identidad con los m\xE9todos anteriores, comun\xEDcate con nuestro equipo de soporte.",
          title: "Necesitas ayuda con la verificaci\xF3n?"
        },
        subtitle: "Selecciona uno de los m\xE9todos disponibles para verificar tu identidad.",
        title: "Reverificaci\xF3n de identidad"
      },
      backupCodeMfa: {
        subtitle: "Introduce tu c\xF3digo de respaldo para continuar con el acceso.",
        title: "Verificaci\xF3n por c\xF3digo de respaldo"
      },
      emailCode: {
        formTitle: "Ingresa el c\xF3digo que hemos enviado a tu correo electr\xF3nico.",
        resendButton: "Reenviar c\xF3digo",
        subtitle: "Revisa tu bandeja de entrada para el c\xF3digo de verificaci\xF3n.",
        title: "Verificaci\xF3n por correo electr\xF3nico"
      },
      noAvailableMethods: {
        message: "Lo sentimos, no tienes ning\xFAn m\xE9todo de verificaci\xF3n disponible. Contacta con soporte.",
        subtitle: "No se encontraron m\xE9todos alternativos disponibles.",
        title: "M\xE9todos de verificaci\xF3n no disponibles"
      },
      passkey: {
        blockButton__passkey: void 0,
        subtitle: void 0,
        title: void 0
      },
      password: {
        actionLink: "\xBFOlvidaste tu contrase\xF1a? Recup\xE9rala aqu\xED.",
        subtitle: "Usa tu contrase\xF1a para verificar tu identidad.",
        title: "Verificaci\xF3n por contrase\xF1a"
      },
      phoneCode: {
        formTitle: "Introduce el c\xF3digo enviado a tu tel\xE9fono.",
        resendButton: "Reenviar c\xF3digo",
        subtitle: "Recibir\xE1s un c\xF3digo SMS para verificar tu identidad.",
        title: "Verificaci\xF3n por tel\xE9fono"
      },
      phoneCodeMfa: {
        formTitle: "C\xF3digo de verificaci\xF3n de 2 pasos",
        resendButton: "Reenviar c\xF3digo",
        subtitle: "Introduce el c\xF3digo de verificaci\xF3n de dos factores enviado a tu tel\xE9fono.",
        title: "Verificaci\xF3n por tel\xE9fono (2FA)"
      },
      totpMfa: {
        formTitle: "C\xF3digo TOTP",
        subtitle: "Introduce el c\xF3digo de autenticaci\xF3n TOTP para completar la verificaci\xF3n.",
        title: "Verificaci\xF3n por TOTP (2FA)"
      }
    },
    signIn: {
      accountSwitcher: {
        action__addAccount: "A\xF1adir cuenta",
        action__signOutAll: "Cerrar sesi\xF3n de todas las cuentas",
        subtitle: "Seleccione la cuenta con la que desea continuar.",
        title: "Elija una cuenta"
      },
      alternativeMethods: {
        actionLink: "Consigue ayuda",
        actionText: "\xBFNo tienes ninguno de estos?",
        blockButton__backupCode: "Usa un c\xF3digo de respaldo",
        blockButton__emailCode: "Enviar c\xF3digo a {{identifier}}",
        blockButton__emailLink: "Enviar enlace a {{identifier}}",
        blockButton__passkey: "Usar llave de acceso",
        blockButton__password: "Entra con tu contrase\xF1a",
        blockButton__phoneCode: "Enviar c\xF3digo a {{identifier}}",
        blockButton__totp: "Usa tu aplicaci\xF3n de autenticaci\xF3n",
        getHelp: {
          blockButton__emailSupport: "Soporte de correo electr\xF3nico",
          content: "Si tiene dificultades para iniciar sesi\xF3n en su cuenta, env\xEDenos un correo electr\xF3nico y trabajaremos con usted para restablecer el acceso lo antes posible.",
          title: "Consigue ayuda"
        },
        subtitle: "\xBFTienes problemas? Puedes usar cualquiera de estos m\xE9todos para iniciar sesi\xF3n.",
        title: "Usa otro m\xE9todo"
      },
      alternativePhoneCodeProvider: {
        formTitle: void 0,
        resendButton: void 0,
        subtitle: void 0,
        title: void 0
      },
      backupCodeMfa: {
        subtitle: "para continuar a {{applicationName}}",
        title: "Introduce un c\xF3digo de seguridad"
      },
      emailCode: {
        formTitle: "C\xF3digo de verificaci\xF3n",
        resendButton: "Reenviar c\xF3digo",
        subtitle: "para continuar a {{applicationName}}",
        title: "Revise su correo electr\xF3nico"
      },
      emailLink: {
        clientMismatch: {
          subtitle: "El cliente no coincide con el solicitado. Por favor, intente de nuevo.",
          title: "Error de cliente no coincidente"
        },
        expired: {
          subtitle: "Regrese a la pesta\xF1a original para continuar.",
          title: "Este enlace de verificaci\xF3n ha expirado"
        },
        failed: {
          subtitle: "Regrese a la pesta\xF1a original para continuar.",
          title: "Este enlace de verificaci\xF3n es inv\xE1lido"
        },
        formSubtitle: "Utilice el enlace de verificaci\xF3n enviado a su correo electr\xF3nico",
        formTitle: "Enlace de verificaci\xF3n",
        loading: {
          subtitle: "Ser\xE1s redirigido pronto",
          title: "Iniciando sesi\xF3n..."
        },
        resendButton: "Reenviar enlace",
        subtitle: "para continuar a {{applicationName}}",
        title: "Revise su correo electr\xF3nico",
        unusedTab: {
          title: "Puede cerrar esta pesta\xF1a"
        },
        verified: {
          subtitle: "Ser\xE1s redirigido pronto",
          title: "Inici\xF3 sesi\xF3n con \xE9xito"
        },
        verifiedSwitchTab: {
          subtitle: "Regrese a la pesta\xF1a original para continuar",
          subtitleNewTab: "Regrese a la pesta\xF1a reci\xE9n abierta para continuar",
          titleNewTab: "Inici\xF3 sesi\xF3n en otra pesta\xF1a"
        }
      },
      forgotPassword: {
        formTitle: "C\xF3digo de restablecimiento de contrase\xF1a",
        resendButton: "\xBFNo recibiste un c\xF3digo? Reenviar",
        subtitle: "para restablecer tu contrase\xF1a",
        subtitle_email: "Primero, introduce el c\xF3digo enviado a tu correo electr\xF3nico",
        subtitle_phone: "Primero, introduce el c\xF3digo enviado a tu tel\xE9fono",
        title: "Restablecer contrase\xF1a"
      },
      forgotPasswordAlternativeMethods: {
        blockButton__resetPassword: "Restablecer tu contrase\xF1a",
        label__alternativeMethods: "O, inicia sesi\xF3n con otro m\xE9todo",
        title: "\xBFOlvidaste tu contrase\xF1a?"
      },
      noAvailableMethods: {
        message: "No se puede continuar con el inicio de sesi\xF3n. No hay ning\xFAn factor de autenticaci\xF3n disponible.",
        subtitle: "Ocurri\xF3 un error",
        title: "No puedo iniciar sesi\xF3n"
      },
      passkey: {
        subtitle: "Use su clave de acceso para continuar con la autenticaci\xF3n.",
        title: "Clave de acceso"
      },
      password: {
        actionLink: "Usa otro m\xE9todo",
        subtitle: "para continuar a {{applicationName}}",
        title: "Introduzca su contrase\xF1a"
      },
      passwordPwned: {
        title: "Tu contrase\xF1a ha sido comprometida"
      },
      phoneCode: {
        formTitle: "C\xF3digo de verificaci\xF3n",
        resendButton: "Reenviar c\xF3digo",
        subtitle: "para continuar a {{applicationName}}",
        title: "Revisa tu tel\xE9fono"
      },
      phoneCodeMfa: {
        formTitle: "C\xF3digo de verificaci\xF3n",
        resendButton: "Reenviar c\xF3digo",
        subtitle: "Introduce el c\xF3digo enviado a tu tel\xE9fono para continuar.",
        title: "Revisa tu tel\xE9fono"
      },
      resetPassword: {
        formButtonPrimary: "Restablecer Contrase\xF1a",
        requiredMessage: "Por razones de seguridad, se requiere restablecer su contrase\xF1a.",
        successMessage: "Tu contrase\xF1a ha sido cambiada exitosamente. Iniciando sesi\xF3n, por favor espera un momento.",
        title: "Establecer nueva contrase\xF1a"
      },
      resetPasswordMfa: {
        detailsLabel: "Necesitamos verificar tu identidad antes de restablecer tu contrase\xF1a."
      },
      start: {
        actionLink: "Reg\xEDstrese",
        actionLink__join_waitlist: "\xDAnase a la lista de espera",
        actionLink__use_email: "Usar correo electr\xF3nico",
        actionLink__use_email_username: "Usar correo electr\xF3nico o nombre de usuario",
        actionLink__use_passkey: "Usar una clave de acceso",
        actionLink__use_phone: "Usar tel\xE9fono",
        actionLink__use_username: "Usar nombre de usuario",
        actionText: "\xBFNo tienes cuenta?",
        actionText__join_waitlist: "\xBFTe gustar\xEDa unirte a la lista de espera?",
        alternativePhoneCodeProvider: {
          actionLink: void 0,
          label: void 0,
          subtitle: void 0,
          title: void 0
        },
        subtitle: "para continuar a {{applicationName}}",
        subtitleCombined: void 0,
        title: "Entrar",
        titleCombined: void 0
      },
      totpMfa: {
        formTitle: "C\xF3digo de verificaci\xF3n",
        subtitle: "Introduce el c\xF3digo que te enviamos a tu dispositivo",
        title: "Verificaci\xF3n de dos pasos"
      }
    },
    signInEnterPasswordTitle: "Ingresa tu contrase\xF1a",
    signUp: {
      alternativePhoneCodeProvider: {
        resendButton: void 0,
        subtitle: void 0,
        title: void 0
      },
      continue: {
        actionLink: "Entrar",
        actionText: "\xBFTiene una cuenta?",
        subtitle: "para continuar a {{applicationName}}",
        title: "Rellene los campos que faltan"
      },
      emailCode: {
        formSubtitle: "Introduzca el c\xF3digo de verificaci\xF3n enviado a su correo electr\xF3nico",
        formTitle: "C\xF3digo de verificaci\xF3n",
        resendButton: "Re-enviar c\xF3digo",
        subtitle: "para continuar a {{applicationName}}",
        title: "Verifique su correo electr\xF3nico"
      },
      emailLink: {
        clientMismatch: {
          subtitle: "Parece que no est\xE1s usando el dispositivo correcto para verificar tu cuenta.",
          title: "Error de dispositivo"
        },
        formSubtitle: "Utilice el enlace de verificaci\xF3n enviado a su direcci\xF3n de correo electr\xF3nico",
        formTitle: "Enlace de verificaci\xF3n",
        loading: {
          title: "Registrando..."
        },
        resendButton: "Reenviar enlace",
        subtitle: "para continuar a {{applicationName}}",
        title: "Verifica tu correo electr\xF3nico",
        verified: {
          title: "Registrado con \xE9xito"
        },
        verifiedSwitchTab: {
          subtitle: "Regrese a la pesta\xF1a reci\xE9n abierta para continuar",
          subtitleNewTab: "Volver a la pesta\xF1a anterior para continuar",
          title: "Correo electr\xF3nico verificado con \xE9xito"
        }
      },
      legalConsent: {
        checkbox: {
          label__onlyPrivacyPolicy: "He le\xEDdo y acepto la Pol\xEDtica de Privacidad",
          label__onlyTermsOfService: "He le\xEDdo y acepto los T\xE9rminos de Servicio",
          label__termsOfServiceAndPrivacyPolicy: 'He le\xEDdo y acepto los {{ termsOfServiceLink || link("T\xE9rminos de Servicio") }} y la {{ privacyPolicyLink || link("Pol\xEDtica de Privacidad") }}'
        },
        continue: {
          subtitle: "Al continuar, aceptas las condiciones mencionadas.",
          title: "Por favor, acepta nuestros t\xE9rminos y pol\xEDticas para continuar"
        }
      },
      phoneCode: {
        formSubtitle: "Introduzca el c\xF3digo de verificaci\xF3n enviado a su n\xFAmero de tel\xE9fono",
        formTitle: "C\xF3digo de verificaci\xF3n",
        resendButton: "Re-enviar c\xF3digo",
        subtitle: "para continuar a {{applicationName}}",
        title: "Verifique su tel\xE9fono"
      },
      restrictedAccess: {
        actionLink: "Cont\xE1ctanos para m\xE1s informaci\xF3n",
        actionText: "\xBFTienes problemas? Obt\xE9n ayuda",
        blockButton__emailSupport: "Soporte por correo electr\xF3nico",
        blockButton__joinWaitlist: "Unirte a la lista de espera",
        subtitle: "El acceso a esta funcionalidad est\xE1 restringido en este momento.",
        subtitleWaitlist: "Te has unido a la lista de espera. Nos pondremos en contacto contigo pronto.",
        title: "Acceso restringido"
      },
      start: {
        actionLink: "Iniciar sesi\xF3n",
        actionLink__use_email: "Usar correo electr\xF3nico",
        actionLink__use_phone: "Usar tel\xE9fono",
        actionText: "\xBFYa tienes una cuenta?",
        alternativePhoneCodeProvider: {
          actionLink: void 0,
          label: void 0,
          subtitle: void 0,
          title: void 0
        },
        subtitle: "para continuar en {{applicationName}}",
        subtitleCombined: "para continuar en {{applicationName}}",
        title: "Crea tu cuenta",
        titleCombined: "Crea tu cuenta"
      }
    },
    socialButtonsBlockButton: "Continuar con {{provider|titleize}}",
    socialButtonsBlockButtonManyInView: void 0,
    unstable__errors: {
      already_a_member_in_organization: "{{email}} ya es miembro de la organizaci\xF3n.",
      captcha_invalid: "Registro fallido debido a validaciones de seguridad fallidas. Por favor, actualice la p\xE1gina para intentarlo de nuevo o comun\xEDquese con el soporte para m\xE1s asistencia.",
      captcha_unavailable: "Registro fallido debido a una validaci\xF3n de bot fallida. Por favor, actualice la p\xE1gina para intentarlo de nuevo o comun\xEDquese con el soporte para m\xE1s asistencia.",
      form_code_incorrect: "El c\xF3digo ingresado es incorrecto.",
      form_identifier_exists__email_address: "Ya existe una cuenta con esta direcci\xF3n de correo electr\xF3nico.",
      form_identifier_exists__phone_number: "Ya existe una cuenta con este n\xFAmero de tel\xE9fono.",
      form_identifier_exists__username: "Ya existe una cuenta con este nombre de usuario.",
      form_identifier_not_found: "No se ha encontrado ninguna cuenta con este identificador.",
      form_param_format_invalid: "Formato de par\xE1metro inv\xE1lido.",
      form_param_format_invalid__email_address: "La direcci\xF3n de correo electr\xF3nico debe ser una direcci\xF3n de correo electr\xF3nico v\xE1lida.",
      form_param_format_invalid__phone_number: "El n\xFAmero de tel\xE9fono debe estar en un formato internacional v\xE1lido.",
      form_param_max_length_exceeded__first_name: "El nombre no debe exceder los 256 caracteres.",
      form_param_max_length_exceeded__last_name: "El apellido no debe exceder los 256 caracteres.",
      form_param_max_length_exceeded__name: "El nombre no debe exceder los 256 caracteres.",
      form_param_nil: "Este campo es obligatorio.",
      form_param_type_invalid: void 0,
      form_param_type_invalid__email_address: void 0,
      form_param_type_invalid__phone_number: void 0,
      form_param_value_invalid: "Valor inv\xE1lido.",
      form_password_incorrect: "Contrase\xF1a incorrecta.",
      form_password_length_too_short: "La contrase\xF1a es demasiado corta.",
      form_password_not_strong_enough: "Tu contrase\xF1a no es lo suficientemente fuerte.",
      form_password_pwned: "Tu contrase\xF1a ha sido comprometida en una violaci\xF3n de seguridad.",
      form_password_pwned__sign_in: "La contrase\xF1a ya est\xE1 en uso en otro servicio.",
      form_password_size_in_bytes_exceeded: "Tu contrase\xF1a ha excedido el n\xFAmero m\xE1ximo de bytes permitidos, por favor ac\xF3rtala o elimina algunos caracteres especiales.",
      form_password_validation_failed: "La validaci\xF3n de la contrase\xF1a fall\xF3.",
      form_username_invalid_character: "El nombre de usuario contiene caracteres inv\xE1lidos.",
      form_username_invalid_length: "El nombre de usuario debe tener entre 3 y 20 caracteres.",
      identification_deletion_failed: "No puedes eliminar tu \xFAltima identificaci\xF3n.",
      not_allowed_access: "La direcci\xF3n de correo electr\xF3nico o el n\xFAmero de tel\xE9fono no est\xE1 permitido para registrarse. Esto puede deberse al uso de '+', '=', '#' o '.' en tu direcci\xF3n de correo electr\xF3nico, el uso de un dominio conectado a un servicio de correo electr\xF3nico temporal o la exclusi\xF3n expl\xEDcita. Si cree que se trata de un error, p\xF3ngase en contacto con el soporte.",
      organization_domain_blocked: "Este es un dominio bloqueado, por favor usa otro.",
      organization_domain_common: "Este es un dominio com\xFAn, por favor usa otro.",
      organization_domain_exists_for_enterprise_connection: void 0,
      organization_membership_quota_exceeded: "Has alcanzado tu l\xEDmite de miembros de la organizaci\xF3n, incluyendo invitaciones pendientes.",
      organization_minimum_permissions_needed: "Es necesario que haya al menos un miembro de la organizaci\xF3n con los permisos m\xEDnimos necesarios.",
      passkey_already_exists: "Ya existe una clave de acceso.",
      passkey_not_supported: "Las claves de acceso no son compatibles.",
      passkey_pa_not_supported: "La clave de acceso no es compatible con la autenticaci\xF3n de dispositivos.",
      passkey_registration_cancelled: "El registro de la clave de acceso fue cancelado.",
      passkey_retrieval_cancelled: "La recuperaci\xF3n de la clave de acceso fue cancelada.",
      passwordComplexity: {
        maximumLength: "Menos de {{length}} caracteres",
        minimumLength: "{{length}} caracteres o m\xE1s",
        requireLowercase: "Al menos una letra min\xFAscula",
        requireNumbers: "Al menos un n\xFAmero",
        requireSpecialCharacter: "Al menos un car\xE1cter especial",
        requireUppercase: "Al menos una letra may\xFAscula",
        sentencePrefix: "Tu contrase\xF1a debe contener:"
      },
      phone_number_exists: "Este n\xFAmero de tel\xE9fono ya est\xE1 en uso. Por favor, int\xE9ntelo con otro.",
      session_exists: "Ya has iniciado sesi\xF3n",
      web3_missing_identifier: void 0,
      zxcvbn: {
        couldBeStronger: void 0,
        goodPassword: void 0,
        notEnough: void 0,
        suggestions: {
          allUppercase: void 0,
          anotherWord: void 0,
          associatedYears: void 0,
          capitalization: void 0,
          dates: void 0,
          l33t: void 0,
          longerKeyboardPattern: void 0,
          noNeed: void 0,
          pwned: void 0,
          recentYears: void 0,
          repeated: void 0,
          reverseWords: void 0,
          sequences: void 0,
          useWords: void 0
        },
        warnings: {
          common: void 0,
          commonNames: void 0,
          dates: void 0,
          extendedRepeat: void 0,
          keyPattern: void 0,
          namesByThemselves: void 0,
          pwned: void 0,
          recentYears: void 0,
          sequences: void 0,
          similarToCommon: void 0,
          simpleRepeat: void 0,
          straightRow: void 0,
          topHundred: void 0,
          topTen: void 0,
          userInputs: void 0,
          wordByItself: void 0
        }
      }
    },
    userButton: {
      action__addAccount: "A\xF1adir cuenta",
      action__manageAccount: "Administrar cuenta",
      action__signOut: "Cerrar sesi\xF3n",
      action__signOutAll: "Salir de todas las cuentas"
    },
    userProfile: {
      apiKeysPage: {
        title: void 0
      },
      backupCodePage: {
        actionLabel__copied: "\xA1Copiado!",
        actionLabel__copy: "Copiar todo",
        actionLabel__download: "Descargar .txt",
        actionLabel__print: "Imprimir",
        infoText1: "Se habilitar\xE1n c\xF3digos de respaldo para esta cuenta.",
        infoText2: "Mantenga los c\xF3digos de respaldo en secreto y gu\xE1rdelos de forma segura. Puede regenerar c\xF3digos de respaldo si sospecha que se han visto comprometidos.",
        subtitle__codelist: "Gu\xE1rdelos de forma segura y mant\xE9ngalos en secreto.",
        successMessage: "Los c\xF3digos de respaldo ahora est\xE1n habilitados. Puede usar uno de estos para iniciar sesi\xF3n en su cuenta, si pierde el acceso a su dispositivo de autenticaci\xF3n. Cada c\xF3digo solo se puede utilizar una vez.",
        successSubtitle: "Puede usar uno de estos para iniciar sesi\xF3n en su cuenta, si pierde el acceso a su dispositivo de autenticaci\xF3n.",
        title: "Agregar verificaci\xF3n de c\xF3digo de respaldo",
        title__codelist: "C\xF3digos de respaldo"
      },
      billingPage: {
        paymentHistorySection: {
          empty: void 0,
          notFound: void 0,
          tableHeader__amount: void 0,
          tableHeader__date: void 0,
          tableHeader__status: void 0
        },
        paymentSourcesSection: {
          actionLabel__default: void 0,
          actionLabel__remove: void 0,
          add: void 0,
          addSubtitle: void 0,
          cancelButton: void 0,
          formButtonPrimary__add: void 0,
          formButtonPrimary__pay: void 0,
          payWithTestCardButton: void 0,
          removeResource: {
            messageLine1: void 0,
            messageLine2: void 0,
            successMessage: void 0,
            title: void 0
          },
          title: void 0
        },
        start: {
          headerTitle__payments: void 0,
          headerTitle__plans: void 0,
          headerTitle__statements: void 0,
          headerTitle__subscriptions: void 0
        },
        statementsSection: {
          empty: void 0,
          itemCaption__paidForPlan: void 0,
          itemCaption__proratedCredit: void 0,
          itemCaption__subscribedAndPaidForPlan: void 0,
          notFound: void 0,
          tableHeader__amount: void 0,
          tableHeader__date: void 0,
          title: void 0,
          totalPaid: void 0
        },
        subscriptionsListSection: {
          actionLabel__newSubscription: void 0,
          actionLabel__switchPlan: void 0,
          tableHeader__edit: void 0,
          tableHeader__plan: void 0,
          tableHeader__startDate: void 0,
          title: void 0
        },
        subscriptionsSection: {
          actionLabel__default: void 0
        },
        switchPlansSection: {
          title: void 0
        },
        title: void 0
      },
      connectedAccountPage: {
        formHint: "Seleccione un proveedor para conectar su cuenta.",
        formHint__noAccounts: "No hay proveedores de cuentas externas disponibles.",
        removeResource: {
          messageLine1: "{{identifier}} ser\xE1 eliminado de esta cuenta.",
          messageLine2: "Ya no podr\xE1 usar esta cuenta activa y las funciones dependientes ya no funcionar\xE1n.",
          successMessage: "{{connectedAccount}} ha sido eliminado de su cuenta.",
          title: "Eliminar cuenta conectada"
        },
        socialButtonsBlockButton: "Conectar cuenta de {{provider | titleize}}",
        successMessage: "El proveedor ha sido agregado a su cuenta",
        title: "Agregar cuenta conectada"
      },
      deletePage: {
        actionDescription: 'Escribe "Eliminar cuenta" a continuaci\xF3n para continuar.',
        confirm: "Eliminar cuenta",
        messageLine1: "\xBFEst\xE1s seguro de que quieres eliminar tu cuenta?",
        messageLine2: "Esta acci\xF3n es permanente e irreversible.",
        title: "Eliminar cuenta"
      },
      emailAddressPage: {
        emailCode: {
          formHint: "A esta direcci\xF3n de correo electr\xF3nico se le enviar\xE1 un correo electr\xF3nico con un C\xF3digo de verificaci\xF3n.",
          formSubtitle: "Introduzca el c\xF3digo de verificaci\xF3n enviado a {{identifier}}",
          formTitle: "C\xF3digo de verificaci\xF3n",
          resendButton: "Re-enviar c\xF3digo",
          successMessage: "El correo electr\xF3nico {{identifier}} se ha agregado a su cuenta."
        },
        emailLink: {
          formHint: "Se enviar\xE1 un correo electr\xF3nico con un enlace de verificaci\xF3n a esta direcci\xF3n de correo electr\xF3nico.",
          formSubtitle: "Haga clic en el enlace de verificaci\xF3n en el correo electr\xF3nico enviado a {{identifier}}",
          formTitle: "Enlace de verificaci\xF3n",
          resendButton: "Reenviar enlace",
          successMessage: "El correo electr\xF3nico {{identifier}} se ha agregado a su cuenta."
        },
        enterpriseSSOLink: {
          formButton: void 0,
          formSubtitle: void 0
        },
        formHint: void 0,
        removeResource: {
          messageLine1: "{{identifier}} ser\xE1 eliminado de esta cuenta.",
          messageLine2: "Ya no podr\xE1 iniciar sesi\xF3n con esta direcci\xF3n de correo electr\xF3nico.",
          successMessage: "{{emailAddress}} ha sido eliminado de su cuenta.",
          title: "Eliminar direcci\xF3n de correo electr\xF3nico"
        },
        title: "Agregar direcci\xF3n de correo electr\xF3nico",
        verifyTitle: "Verificar correo electr\xF3nico"
      },
      formButtonPrimary__add: "Agregar",
      formButtonPrimary__continue: "Continuar",
      formButtonPrimary__finish: "Terminar",
      formButtonPrimary__remove: "Eliminar",
      formButtonPrimary__save: "Guardar",
      formButtonReset: "Cancelar",
      mfaPage: {
        formHint: "Seleccione un m\xE9todo para agregar.",
        title: "Agregar verificaci\xF3n en dos pasos"
      },
      mfaPhoneCodePage: {
        backButton: "Usar n\xFAmero existente",
        primaryButton__addPhoneNumber: "Agregar un n\xFAmero de tel\xE9fono",
        removeResource: {
          messageLine1: "{{identifier}} dejar\xE1 de recibir el C\xF3digo de verificaci\xF3n al iniciar sesi\xF3n.",
          messageLine2: "Es posible que su cuenta no sea tan segura. \xBFEst\xE1s seguro de que quieres continuar?",
          successMessage: "Se elimin\xF3 la verificaci\xF3n de dos pasos del c\xF3digo SMS para {{mfaPhoneCode}}",
          title: "Eliminar la verificaci\xF3n en dos pasos"
        },
        subtitle__availablePhoneNumbers: "Seleccione un n\xFAmero de tel\xE9fono para registrarse para la verificaci\xF3n en dos pasos del c\xF3digo SMS.",
        subtitle__unavailablePhoneNumbers: "No hay n\xFAmeros de tel\xE9fono disponibles para registrarse para la verificaci\xF3n en dos pasos del c\xF3digo SMS.",
        successMessage1: "Al iniciar sesi\xF3n, deber\xE1 ingresar un c\xF3digo de verificaci\xF3n enviado a este n\xFAmero de tel\xE9fono como un paso adicional.",
        successMessage2: "Guarde estos c\xF3digos de respaldo y almac\xE9nelos en un lugar seguro. Si pierde el acceso a su dispositivo de autenticaci\xF3n, puede usar los c\xF3digos de respaldo para iniciar sesi\xF3n.",
        successTitle: "Verificaci\xF3n de c\xF3digo SMS habilitada",
        title: "Agregar verificaci\xF3n de c\xF3digo SMS"
      },
      mfaTOTPPage: {
        authenticatorApp: {
          buttonAbleToScan__nonPrimary: "Escanea el c\xF3digo QR en su lugar",
          buttonUnableToScan__nonPrimary: "\xBFNo puedes escanear el c\xF3digo QR?",
          infoText__ableToScan: "Configure un nuevo m\xE9todo de inicio de sesi\xF3n en su aplicaci\xF3n de autenticaci\xF3n y escanee el siguiente c\xF3digo QR para vincularlo a su cuenta.",
          infoText__unableToScan: "Configure un nuevo m\xE9todo de inicio de sesi\xF3n en su autenticador e ingrese la clave que se proporciona a continuaci\xF3n.",
          inputLabel__unableToScan1: "Aseg\xFArese de que las contrase\xF1as basadas en el tiempo o de un solo uso est\xE9n habilitadas, luego termine de vincular su cuenta.",
          inputLabel__unableToScan2: "Alternativamente, si su autenticador admite TOTP URIs, tambi\xE9n puede copiar el URI completo."
        },
        removeResource: {
          messageLine1: "El c\xF3digo de verificaci\xF3n de este autenticador ya no ser\xE1 necesario al iniciar sesi\xF3n.",
          messageLine2: "Es posible que su cuenta no sea tan segura. \xBFEst\xE1s seguro de que quieres continuar?",
          successMessage: "Se elimin\xF3 la verificaci\xF3n en dos pasos a trav\xE9s de la aplicaci\xF3n de autenticaci\xF3n.",
          title: "Eliminar la verificaci\xF3n en dos pasos"
        },
        successMessage: "La verificaci\xF3n en dos pasos ahora est\xE1 habilitada. Al iniciar sesi\xF3n, deber\xE1 ingresar un c\xF3digo de verificaci\xF3n de este autenticador como un paso adicional.",
        title: "Agregar aplicaci\xF3n de autenticaci\xF3n",
        verifySubtitle: "Ingrese el c\xF3digo de verificaci\xF3n generado por su autenticador",
        verifyTitle: "C\xF3digo de verificaci\xF3n"
      },
      mobileButton__menu: "Men\xFA",
      navbar: {
        account: "Perfil",
        apiKeys: void 0,
        billing: void 0,
        description: "Gestiona la informaci\xF3n de tu cuenta.",
        security: "Seguridad",
        title: "Cuenta"
      },
      passkeyScreen: {
        removeResource: {
          messageLine1: "\xBFEst\xE1s seguro de que deseas eliminar este recurso?",
          title: "Eliminar Recurso"
        },
        subtitle__rename: "Ingresa el nuevo nombre para la clave de acceso.",
        title__rename: "Renombrar Clave de Acceso"
      },
      passwordPage: {
        checkboxInfoText__signOutOfOtherSessions: "Se recomienda cerrar sesi\xF3n en todos los dem\xE1s dispositivos que puedan haber usado su contrase\xF1a anterior.",
        readonly: "Su contrase\xF1a actualmente no puede ser editada porque solo puede iniciar sesi\xF3n a trav\xE9s de la conexi\xF3n empresarial.",
        successMessage__set: "Su contrase\xF1a ha sido establecida.",
        successMessage__signOutOfOtherSessions: "Todos los dem\xE1s dispositivos han cerrado sesi\xF3n.",
        successMessage__update: "Tu contrase\xF1a ha sido actualizada.",
        title__set: "Configurar la clave",
        title__update: "Cambiar contrase\xF1a"
      },
      phoneNumberPage: {
        infoText: "Se enviar\xE1 un mensaje de texto con un enlace de verificaci\xF3n a este n\xFAmero de tel\xE9fono.",
        removeResource: {
          messageLine1: "{{identifier}} ser\xE1 eliminado de esta cuenta.",
          messageLine2: "Ya no podr\xE1 iniciar sesi\xF3n con este n\xFAmero de tel\xE9fono.",
          successMessage: "{{phoneNumber}} ha sido eliminado de su cuenta.",
          title: "Eliminar n\xFAmero de tel\xE9fono"
        },
        successMessage: "{{identifier}} ha sido a\xF1adido a tu cuenta.",
        title: "Agregar el n\xFAmero de tel\xE9fono",
        verifySubtitle: "Introduzca el c\xF3digo de verificaci\xF3n enviado a {{identifier}}",
        verifyTitle: "Verificar n\xFAmero de tel\xE9fono"
      },
      plansPage: {
        title: void 0
      },
      profilePage: {
        fileDropAreaHint: "Cargue una imagen JPG, PNG, GIF o WEBP de menos de 10 MB",
        imageFormDestructiveActionSubtitle: "Eliminar la imagen",
        imageFormSubtitle: "Cargar imagen",
        imageFormTitle: "Imagen de perfil",
        readonly: "La informaci\xF3n de su perfil ha sido proporcionada por la conexi\xF3n empresarial y no puede ser editada.",
        successMessage: "Tu perfil ha sido actualizado.",
        title: "Actualizar Cuenta"
      },
      start: {
        activeDevicesSection: {
          destructiveAction: "Cerrar sesi\xF3n en el dispositivo",
          title: "Dispositivos activos"
        },
        connectedAccountsSection: {
          actionLabel__connectionFailed: "Int\xE9ntelo nuevamente",
          actionLabel__reauthorize: "Autorizar ahora",
          destructiveActionTitle: "Quitar",
          primaryButton: "Conectar cuenta",
          subtitle__disconnected: void 0,
          subtitle__reauthorize: "Los permisos necesarios han sido actualizados, y podr\xEDa estar experimentando funcionalidad limitada. Por favor, reautorice esta aplicaci\xF3n para evitar problemas.",
          title: "Cuentas conectadas"
        },
        dangerSection: {
          deleteAccountButton: "Eliminar cuenta",
          title: "Eliminar cuenta"
        },
        emailAddressesSection: {
          destructiveAction: "Eliminar direcci\xF3n de correo electr\xF3nico",
          detailsAction__nonPrimary: "Establecer como primario",
          detailsAction__primary: "Completar la verificaci\xF3n",
          detailsAction__unverified: "Completar la verificaci\xF3n",
          primaryButton: "Agregar una direcci\xF3n de correo electr\xF3nico",
          title: "Correos electr\xF3nicos"
        },
        enterpriseAccountsSection: {
          title: "Cuentas empresariales"
        },
        headerTitle__account: "Cuenta",
        headerTitle__security: "Seguridad",
        mfaSection: {
          backupCodes: {
            actionLabel__regenerate: "Regenerar c\xF3digos",
            headerTitle: "C\xF3digos de respaldo",
            subtitle__regenerate: "Obtenga un nuevo conjunto de c\xF3digos de respaldo seguros. Los c\xF3digos de respaldo anteriores se eliminar\xE1n y no podr\xE1n ser usados.",
            title__regenerate: "Regenerar c\xF3digos de respaldo"
          },
          phoneCode: {
            actionLabel__setDefault: "Establecer por defecto",
            destructiveActionLabel: "Eliminar n\xFAmero telef\xF3nico"
          },
          primaryButton: "A\xF1adir verificaci\xF3n de dos pasos",
          title: "Verificaci\xF3n de dos pasos",
          totp: {
            destructiveActionTitle: "Eliminar",
            headerTitle: "Aplicaci\xF3n de autenticaci\xF3n"
          }
        },
        passkeysSection: {
          menuAction__destructive: "Eliminar Clave de Acceso",
          menuAction__rename: "Renombrar Clave de Acceso",
          primaryButton: void 0,
          title: "Secci\xF3n de Claves de Acceso"
        },
        passwordSection: {
          primaryButton__setPassword: "Establecer contrase\xF1a",
          primaryButton__updatePassword: "Cambiar contrase\xF1a",
          title: "Contrase\xF1a"
        },
        phoneNumbersSection: {
          destructiveAction: "Quitar n\xFAmero de tel\xE9fono",
          detailsAction__nonPrimary: "Establecer como primario",
          detailsAction__primary: "Completar la verificaci\xF3n",
          detailsAction__unverified: "Completar la verificaci\xF3n",
          primaryButton: "Agregar un n\xFAmero de tel\xE9fono",
          title: "N\xFAmeros telef\xF3nicos"
        },
        profileSection: {
          primaryButton: "Actualizar perfil",
          title: "Perfil"
        },
        usernameSection: {
          primaryButton__setUsername: "Crear nombre de usuario",
          primaryButton__updateUsername: "Cambiar nombre de usuario",
          title: "Nombre de usuario"
        },
        web3WalletsSection: {
          destructiveAction: "Quitar cartera",
          detailsAction__nonPrimary: void 0,
          primaryButton: "Agregar cartera Web3",
          title: "Cartera Web3"
        }
      },
      usernamePage: {
        successMessage: "Su nombre de usuario ha sido actualizado.",
        title__set: "Actualizar nombre de usuario",
        title__update: "Actualizar nombre de usuario"
      },
      web3WalletPage: {
        removeResource: {
          messageLine1: "{{identifier}} ser\xE1 eliminado de esta cuenta.",
          messageLine2: "Ya no podr\xE1 iniciar sesi\xF3n con esta billetera web3.",
          successMessage: "{{web3Wallet}} ha sido eliminado de su cuenta.",
          title: "Eliminar la billetera web3"
        },
        subtitle__availableWallets: "Seleccione una billetera web3 para conectarse a su cuenta.",
        subtitle__unavailableWallets: "No hay billeteras web3 disponibles.",
        successMessage: "La billetera ha sido agregada a su cuenta.",
        title: "A\xF1adir billetera Web3",
        web3WalletButtonsBlockButton: "Conectar billetera"
      }
    },
    waitlist: {
      start: {
        actionLink: "\xA1\xDAnete a la lista de espera!",
        actionText: "Si no tienes acceso, puedes unirte a nuestra lista de espera para recibir una invitaci\xF3n m\xE1s adelante.",
        formButton: "Unirse ahora",
        subtitle: "S\xE9 uno de los primeros en acceder a {{applicationName}}.",
        title: "\xDAnete a la lista de espera"
      },
      success: {
        message: "\xA1Felicidades! Te has unido exitosamente a la lista de espera.",
        subtitle: "Recibir\xE1s una invitaci\xF3n para unirte cuando haya espacio disponible.",
        title: "\xA1Te has unido a la lista de espera!"
      }
    }
  };
})();
