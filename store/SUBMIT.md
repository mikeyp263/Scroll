# Getting Scroll on the App Store

You need: a Mac with Xcode, an iPhone, and an Apple Developer account ($99/year at developer.apple.com/programs/enroll; approval can take a day or two, so start this first).

## 1. Get the project onto your Mac (one time)

Install Node if you don't have it: download the LTS version from nodejs.org.

Then in Terminal:

```bash
git clone https://github.com/mikeyp263/Scroll.git
cd Scroll
npm install
npx cap sync ios
npx cap open ios
```

Xcode opens. Wait for it to finish "Resolving Package Graph" (bottom of the left sidebar), about a minute the first time.

## 2. Run it on your iPhone

1. In Xcode's left sidebar, click **App** (the blue icon at the top), then the **App** target, then **Signing & Capabilities**.
2. Check **Automatically manage signing**. For **Team**, pick your Apple account (Xcode > Settings > Accounts to sign in if it's not listed).
3. If Xcode says the bundle ID is unavailable, change `com.mikeypatterson.scroll` to something unique, like `com.mikeypatterson.scrollbible`. Also change it in `capacitor.config.json` so they match.
4. Plug in your iPhone, pick it at the top of Xcode, and press **Run** (the play button).
5. First time only: on the iPhone, go to Settings > Privacy & Security > **Developer Mode** and turn it on, then trust the developer under Settings > General > VPN & Device Management.

Use it for a few days. Tell me anything that feels off.

## 3. Create the app in App Store Connect

1. Go to appstoreconnect.apple.com > **Apps** > **+** > **New App**.
2. Platform iOS. Name, bundle ID, and SKU are in `store/LISTING.md`. User access: Full.

## 4. Upload a build

1. In Xcode, set the device at the top to **Any iOS Device (arm64)**.
2. **Product > Archive**. When it finishes, the Organizer opens.
3. Click **Distribute App > App Store Connect > Upload**, accept the defaults.
4. Wait 10 to 30 minutes for it to process. You'll get an email.

For each new version later: bump **Version** (1.0 to 1.1) or **Build** (1 to 2) under the App target's **General** tab, then archive and upload again.

## 5. Fill in the listing and submit

In App Store Connect, open your app:
1. **App Information**: category, content rights, age rating. Everything is in `store/LISTING.md`.
2. **App Privacy**: Privacy Policy URL, then **Get Started > No, we do not collect data**.
3. **Pricing and Availability**: Free.
4. **iOS App > 1.0 Prepare for Submission**: paste the promotional text, description, keywords, support URL. Upload the 6 screenshots from `store/screenshots/`. Pick the build you uploaded. Paste the review notes. Add your contact info for the reviewer.
5. **Add for Review > Submit**.

Review usually takes 1 to 3 days. If Apple rejects it, send me the message and I'll fix it.

## When you ask me for changes later

I update the code and push to GitHub. Then on your Mac:

```bash
cd Scroll
git pull
npm install
npx cap sync ios
```

and archive/upload again (step 4). The web version at mikeyp263.github.io/Scroll updates by itself.
