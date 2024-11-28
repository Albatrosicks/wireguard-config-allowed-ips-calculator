
<h1 align="center">Wireguard "AllowedIPs" Calculator</h1>

A client side Wireguard "AllowedIPs" calculator. This can also be used as a generic tool to exclude a subset of CIDR's from a larger scoped CIDR.

Any change you make to Allowed IPs or Disallowed IPs is persisted in the url hash so you can easily bookmark calculations or send them to others. [For example, allow 0.0.0.0/0, disallow 1.1.1.1 and 8.8.8.8](https://tim-crisp.github.io/wireguard-allowed-ips-calculator#%7B%22allowedIps%22%3A%220.0.0.0%2F0%22%2C%22disallowedIps%22%3A%221.1.1.1%2C%208.8.8.8%22%7D).

---

<div align="center">
  <a href="https://tim-crisp.github.io/wireguard-allowed-ips-calculator">Open App</a>
</div>

---

![dark-mode](public/app-dark.png)

![light-mode](public/app-light.png)

## Credits

- [next.js](https://github.com/vercel/next.js)
- [shadcn](https://github.com/shadcn-ui/ui)
- [cidr-tools](https://github.com/silverwind/cidr-tools)
