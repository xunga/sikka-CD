Sikka._getConfig = function (key, meteorSettingsKey, defaultValue) {

  if(key === 'SIKKA_CAPTCHA_SITE_KEY' && !meteorSettingsKey){
    throw new Meteor.Error('The captcha site key is not defined. please generate one at: https://www.google.com/recaptcha/intro/index.html');
  }

  if(key === 'SIKKA_CAPTCHA_SECRET' && !meteorSettingsKey){
    throw new Meteor.Error('The captcha secret is not defined. please generate one at: https://www.google.com/recaptcha/intro/index.html');
  }

  var envVar = process.env[key];
  if(envVar) {
    return envVar;
  }

  if(Meteor.settings) {
    var parts = meteorSettingsKey.split('.');
    var value = Meteor.settings;
    parts.forEach(function(key) {
      if(value) {
        value = value[key];
      }
    });

    if(value) {
      return value;
    }
  }

  return defaultValue;
};

Config = {};
Config.captcha = {
  siteKey: Sikka._getConfig("SIKKA_CAPTCHA_SITE_KEY", "sikka.captcha.siteKey"),
  secret: Sikka._getConfig("SIKKA_CAPTCHA_SECRET", "sikka.captcha.secret")
};

var perIpLimit = Sikka._getConfig("SIKKA_PER_IP_MAX_RPS", "sikka.rateLimits.perIp", 20);
Config.rateLimits = {
  perIp: perIpLimit,
  perHuman: Sikka._getConfig("SIKKA_PER_HUMAN_MAX_RPS", "sikka.rateLimits.perHuman", perIpLimit),
  perSession: Sikka._getConfig("SIKKA_PER_HUMAN_MAX_RPS", "sikka.rateLimits.perSession", perIpLimit),
};

Config.times = {
  blockIpFor: Sikka._getConfig("SIKKA_BLOCK_IP_FOR_MILLIS", "sikka.times.blockIpFor", 1000 * 60 * 2),
  humanLivesUpto: Sikka._getConfig("SIKKA_HUMAN_LIVES_UPTO_MILLIS", "sikka.times.humanLivesUpto", 1000 * 60 * 60)
};

Config.onlyForHumans = Sikka._getConfig('SIKKA_ONLY_FOR_HUMANS', 'sikka.onlyForHumans', false);

console.log("Sikka: starting with these configurations:", JSON.stringify(Config));


Meteor.startup(function () {
  // Mandatory keys
  if(!(Meteor.settings && Meteor.settings.sikka && Meteor.settings.sikka.captcha && Meteor.settings.sikka.captcha.siteKey)){
    throw new Meteor.Error('The captcha site key is not defined. please generate one at: https://www.google.com/recaptcha/intro/index.html');
  }

  if(!(Meteor.settings && Meteor.settings.sikka && Meteor.settings.sikka.captcha && Meteor.settings.sikka.captcha.secret)){
    throw new Meteor.Error('The captcha secret is not defined. please generate one at: https://www.google.com/recaptcha/intro/index.html');
  }
})
