const auth0TestProfile = {
  auth0ID: "oauth2|spotify|spotify:user:1253470477",
  testDisplayName: "Josh April",
  spotifyUserID: "1253470477",
  playlist: { id: "5KWkZqoYeVXWEgdxbKlTSM", name: "Bogan Girl " },
};

const auth0TestUserObject = {
  country: "NZ",
  created_at: "2024-04-30T09:20:27.994Z",
  display_name: "Josh April",
  email: "joshua28at@hotmail.com",
  explicit_content: { filter_enabled: false, filter_locked: false },
  external_urls: { spotify: "https://open.spotify.com/user/1253470477" },
  followers: { href: null, total: 15 },
  href: "https://api.spotify.com/v1/users/1253470477",
  identities: [
    {
      provider: "oauth2",
      access_token:
        "BQB2HDdxtra3U2UXxolqx8t8ZZH8Qy6JjqpmbHG5_mT8227phHIqkvVjZLltKM9yyBS-BCIAjHNXsJzqHB21BF8D394NuKQcej9qKvA8lGC7BdCAlW4WwpXRs2-Ys2hZO05DQpajdMkKzBzl975ot-urbqkAogdLdO-dsW8Z4fjYt1_yexeim_SJc0QXuPe0mA",
      refresh_token:
        "AQCLms5SjWJz12Oc6rttz2OgR_SBGGUfJhRKo-p-j6zY-IvGnvOoJR4FAxfEGwm-uCzARTwehxW-xG5NXQ9ZBxGFMLYLf4lRB5-G_djzJ19qGB_aQH9EuySqMCGYOY8mkTQ",
      user_id: "spotify|spotify:user:1253470477",
      connection: "spotify",
      isSocial: true,
    },
  ],
  images: [
    {
      url: "https://i.scdn.co/image/ab67757000003b82a97902eae68610957a6f69bd",
      height: 64,
      width: 64,
    },
    {
      url: "https://i.scdn.co/image/ab6775700000ee85a97902eae68610957a6f69bd",
      height: 300,
      width: 300,
    },
  ],
  name: "Josh April",
  nickname: "joshua28at",
  picture:
    "https://s.gravatar.com/avatar/4ed92118b39f9dc8a7f157bb1a03c4fc?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fja.png",
  product: "premium",
  type: "user",
  updated_at: "2024-07-08T02:35:33.965Z",
  uri: "spotify:user:1253470477",
  user_id: "oauth2|spotify|spotify:user:1253470477",
  last_ip: "161.29.23.91",
  last_login: "2024-07-08T02:35:33.964Z",
  logins_count: 87,
};

const userObjectTest = {
  sessionID: "12345678910",
  auth0ID: "1231312313131",
  userProfile: auth0TestUserObject,
};

const spotifyUserObjectTest = {
  accessToken: auth0TestUserObject.identities[0].refresh_token,
  displayName: auth0TestUserObject.display_name,
  image: auth0TestUserObject.images[0].url,
  spotifyID: auth0TestUserObject.user_id,
};

module.exports = {
  auth0TestProfile,
  auth0TestUserObject,
  userObjectTest,
  spotifyUserObjectTest,
};
