import { App } from 'wasp-config'

const app = new App('OpenSaaS', {
  wasp: { version: '^0.17.1' },
  title: 'My Open SaaS App',
  head: [
    "<link rel='icon' href='/favicon.ico' />",
    "<meta charset='utf-8' />",
    "<meta name='description' content='Your apps main description and features.' />",
    "<meta name='author' content='Your (App) Name' />",
    "<meta name='keywords' content='saas, solution, product, app, service' />",
    
    "<meta property='og:type' content='website' />",
    "<meta property='og:title' content='Your Open SaaS App' />",
    "<meta property='og:site_name' content='Your Open SaaS App' />",
    "<meta property='og:url' content='https://your-saas-app.com' />",
    "<meta property='og:description' content='Your apps main description and features.' />",
    "<meta property='og:image' content='https://your-saas-app.com/public-banner.webp' />",
    "<meta name='twitter:image' content='https://your-saas-app.com/public-banner.webp' />",
    "<meta name='twitter:image:width' content='800' />",
    "<meta name='twitter:image:height' content='400' />",
    "<meta name='twitter:card' content='summary_large_image' />",
    // TODO: You can put your Plausible analytics scripts below (https://docs.opensaas.sh/guides/analytics/):
    // NOTE: Plausible does not use Cookies, so you can simply add the scripts here.
    // Google, on the other hand, does, so you must instead add the script dynamically
    // via the Cookie Consent component after the user clicks the "Accept" cookies button.
    "<script defer data-domain='<your-site-id>' src='https://plausible.io/js/script.js'></script>",  // for production
    "<script defer data-domain='<your-site-id>' src='https://plausible.io/js/script.local.js'></script>",  // for development
  ],
});

// 🔐 Auth out of the box! https://wasp.sh/docs/auth/overview
app.auth({
  userEntity: 'User',
  methods: {
    // NOTE: If you decide to not use email auth, make sure to also delete the related routes and pages below.
    //   (RequestPasswordReset(Route|Page), PasswordReset(Route|Page), EmailVerification(Route|Page))
    email: {
      fromField: {
        name: "Open SaaS App",
        email: "me@example.com"
      },
      emailVerification: {
        clientRoute: 'EmailVerificationRoute',
        getEmailContentFn: { import: 'getVerificationEmailContent', from: '@src/auth/email-and-pass/emails' },
      },
      passwordReset: {
        clientRoute: 'PasswordResetRoute',
        getEmailContentFn: { import: 'getPasswordResetEmailContent', from: '@src/auth/email-and-pass/emails' },
      },
      userSignupFields: { import: 'getEmailUserFields', from: '@src/auth/userSignupFields' },
    },
    // Uncomment to enable Google Auth (check https://wasp.sh/docs/auth/social-auth/google for setup instructions):
    // google: { // Guide for setting up Auth via Google
    //   userSignupFields: { import: 'getGoogleUserFields', from: '@src/auth/userSignupFields' },
    //   configFn: { import: 'getGoogleAuthConfig', from: '@src/auth/userSignupFields' },
    // },
    // Uncomment to enable GitHub Auth (check https://wasp.sh/docs/auth/social-auth/github for setup instructions):
    // gitHub: {
    //   userSignupFields: { import: 'getGitHubUserFields', from: '@src/auth/userSignupFields' },
    //   configFn: { import: 'getGitHubAuthConfig', from: '@src/auth/userSignupFields' },
    // },
    // Uncomment to enable Discord Auth (check https://wasp.sh/docs/auth/social-auth/discord for setup instructions):
    // discord: {
    //   userSignupFields: { import: 'getDiscordUserFields', from: '@src/auth/userSignupFields' },
    //   configFn: { import: 'getDiscordAuthConfig', from: '@src/auth/userSignupFields' }
    // }
  },
  onAuthFailedRedirectTo: "/login",
  onAuthSucceededRedirectTo: "/app",
});

app.db({
  // Run `wasp db seed` to seed the database with the seed functions below:
  seeds: [
    // Populates the database with a bunch of fake users to work with during development.
    { import: 'seedMockUsers', from: '@src/server/scripts/dbSeeds' },
  ]
});

app.client({
  rootComponent: { importDefault: 'App', from: '@src/client/App' },
});

app.emailSender({
  // NOTE: "Dummy" provider is just for local development purposes.
  //   Make sure to check the server logs for the email confirmation url (it will not be sent to an address)!
  //   Once you are ready for production, switch to e.g. "SendGrid" or "Mailgun" providers. Check out https://docs.opensaas.sh/guides/email-sending/ .
  provider: 'Dummy',
  defaultFrom: {
    name: "Open SaaS App",
    // When using a real provider, e.g. SendGrid, you must use the same email address that you configured your account to send out emails with!
    email: "me@example.com"
  },
});

// Routes and Pages
const landingPage = app.page('LandingPage', {
  component: { importDefault: 'LandingPage', from: '@src/landing-page/LandingPage' }
});
app.route('LandingPageRoute', { path: '/', to: landingPage });

//#region Auth Pages
const loginPage = app.page('LoginPage', {
  component: { importDefault: 'Login', from: '@src/auth/LoginPage' }
});
app.route('LoginRoute', { path: '/login', to: loginPage });

const signupPage = app.page('SignupPage', {
  component: { import: 'Signup', from: '@src/auth/SignupPage' }
});
app.route('SignupRoute', { path: '/signup', to: signupPage });

const requestPasswordResetPage = app.page('RequestPasswordResetPage', {
  component: { import: 'RequestPasswordResetPage', from: '@src/auth/email-and-pass/RequestPasswordResetPage' },
});
app.route('RequestPasswordResetRoute', { path: '/request-password-reset', to: requestPasswordResetPage });

const passwordResetPage = app.page('PasswordResetPage', {
  component: { import: 'PasswordResetPage', from: '@src/auth/email-and-pass/PasswordResetPage' },
});
app.route('PasswordResetRoute', { path: '/password-reset', to: passwordResetPage });

const emailVerificationPage = app.page('EmailVerificationPage', {
  component: { import: 'EmailVerificationPage', from: '@src/auth/email-and-pass/EmailVerificationPage' },
});
app.route('EmailVerificationRoute', { path: '/email-verification', to: emailVerificationPage });
//#endregion

//#region User
const accountPage = app.page('AccountPage', {
  authRequired: true,
  component: { importDefault: 'Account', from: '@src/user/AccountPage' }
});
app.route('AccountRoute', { path: '/account', to: accountPage });

app.query('getPaginatedUsers', {
  fn: { import: 'getPaginatedUsers', from: '@src/user/operations' },
  entities: ['User']
});

app.action('updateIsUserAdminById', {
  fn: { import: 'updateIsUserAdminById', from: '@src/user/operations' },
  entities: ['User']
});
//#endregion

//#region Main App
const appPage = app.page('AppPage', {
  authRequired: true,
  component: { importDefault: 'AppPage', from: '@src/app/AppPage' }
});
app.route('AppRoute', { path: '/app', to: appPage });

app.action('generateGptResponse', {
  fn: { import: 'generateGptResponse', from: '@src/app/operations' },
  entities: ['User', 'Task', 'GptResponse']
});

app.action('generateTweet', {
  fn: { import: 'generateTweet', from: '@src/app/operations' },
  entities: ['User']
});

app.action('improveTweet', {
  fn: { import: 'improveTweet', from: '@src/app/operations' },
  entities: ['User']
});

app.action('createTask', {
  fn: { import: 'createTask', from: '@src/app/operations' },
  entities: ['Task']
});

app.action('deleteTask', {
  fn: { import: 'deleteTask', from: '@src/app/operations' },
  entities: ['Task']
});

app.action('updateTask', {
  fn: { import: 'updateTask', from: '@src/app/operations' },
  entities: ['Task']
});

app.query('getGptResponses', {
  fn: { import: 'getGptResponses', from: '@src/app/operations' },
  entities: ['User', 'GptResponse']
});

app.query('getAllTasksByUser', {
  fn: { import: 'getAllTasksByUser', from: '@src/app/operations' },
  entities: ['Task']
});
//#endregion

//#region Payment
const pricingPage = app.page('PricingPage', {
  component: { importDefault: 'PricingPage', from: '@src/payment/PricingPage' }
});
app.route('PricingPageRoute', { path: '/pricing', to: pricingPage });

const checkoutPage = app.page('CheckoutPage', {
  authRequired: true,
  component: { importDefault: 'Checkout', from: '@src/payment/CheckoutPage' }
});
app.route('CheckoutRoute', { path: '/checkout', to: checkoutPage });

app.query('getCustomerPortalUrl', {
  fn: { import: 'getCustomerPortalUrl', from: '@src/payment/operations' },
  entities: ['User']
});

app.action('generateCheckoutSession', {
  fn: { import: 'generateCheckoutSession', from: '@src/payment/operations' },
  entities: ['User']
});

app.api('paymentsWebhook', {
  fn: { import: 'paymentsWebhook', from: '@src/payment/webhook' },
  entities: ['User', 'Logs'],
  middlewareConfigFn: { import: 'paymentsMiddlewareConfigFn', from: '@src/payment/webhook' },
  httpRoute: {
    method: 'POST',
    route: '/payments-webhook'
  }
});
//#endregion

//#region File Upload
const fileUploadPage = app.page('FileUploadPage', {
  authRequired: true,
  component: { importDefault: 'FileUpload', from: '@src/file-upload/FileUploadPage' }
});
app.route('FileUploadRoute', { path: '/file-upload', to: fileUploadPage });

app.action('createFile', {
  fn: { import: 'createFile', from: '@src/file-upload/operations' },
  entities: ['User', 'File']
});

app.query('getAllFilesByUser', {
  fn: { import: 'getAllFilesByUser', from: '@src/file-upload/operations' },
  entities: ['User', 'File']
});

app.query('getDownloadFileSignedURL', {
  fn: { import: 'getDownloadFileSignedURL', from: '@src/file-upload/operations' },
  entities: ['User', 'File']
});
//#endregion

//#region Analytics
app.query('getDailyStats', {
  fn: { import: 'getDailyStats', from: '@src/analytics/operations' },
  entities: ['User', 'DailyStats']
});

app.job('dailyStatsJob', {
  executor: 'PgBoss',
  perform: {
    fn: { import: 'calculateDailyStats', from: '@src/analytics/stats' }
  },
  schedule: {
    cron: "0 * * * *" // every hour. useful in production
    // cron: "* * * * *" // every minute. useful for debugging
  },
  entities: ['User', 'DailyStats', 'Logs', 'PageViewSource']
});
//#endregion

//#region Admin Dashboard
const analyticsDashboardPage = app.page('AnalyticsDashboardPage', {
  authRequired: true,
  component: { importDefault: 'AnalyticsDashboardPage', from: '@src/admin/dashboards/analytics/AnalyticsDashboardPage' }
});
app.route('AdminRoute', { path: '/admin', to: analyticsDashboardPage });

const adminUsersPage = app.page('AdminUsersPage', {
  authRequired: true,
  component: { importDefault: 'AdminUsers', from: '@src/admin/dashboards/users/UsersDashboardPage' }
});
app.route('AdminUsersRoute', { path: '/admin/users', to: adminUsersPage });

const adminSettingsPage = app.page('AdminSettingsPage', {
  authRequired: true,
  component: { importDefault: 'AdminSettings', from: '@src/admin/elements/settings/SettingsPage' }
});
app.route('AdminSettingsRoute', { path: '/admin/settings', to: adminSettingsPage });

const adminCalendarPage = app.page('AdminCalendarPage', {
  authRequired: true,
  component: { importDefault: 'AdminCalendar', from: '@src/admin/elements/calendar/CalendarPage' }
});
app.route('AdminCalendarRoute', { path: '/admin/calendar', to: adminCalendarPage });

const adminUIButtonsPage = app.page('AdminUIButtonsPage', {
  authRequired: true,
  component: { importDefault: 'AdminUI', from: '@src/admin/elements/ui-elements/ButtonsPage' }
});
app.route('AdminUIButtonsRoute', { path: '/admin/ui/buttons', to: adminUIButtonsPage });

const notFoundPage = app.page('NotFoundPage', {
  component: { import: 'NotFoundPage', from: '@src/client/components/NotFoundPage' }
});
app.route('NotFoundRoute', { path: '*', to: notFoundPage });
//#endregion

//#region Contact Form Messages
// TODO:
// add functionality to allow users to send messages to admin
// and make them accessible via the admin dashboard
const adminMessagesPage = app.page('AdminMessagesPage', {
  authRequired: true,
  component: { importDefault: 'AdminMessages', from: '@src/messages/MessagesPage' }
});
app.route('AdminMessagesRoute', { path: '/admin/messages', to: adminMessagesPage });
//#endregion

export default app;
