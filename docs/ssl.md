# Local self-signed SSL with Nginx
1. Follow https://gist.github.com/jessedearing/2351836
2. Update nginx config:

```
subl /usr/local/etc/nginx/servers/local.prizefrenzy.com
```

```
server {
    listen 80;

    server_name local.prizefrenzy.com;

    location /api {
      access_log off;
      proxy_pass https://prizefrenzy.com;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}

server {
    listen               443;

    ssl                  on;
    ssl_certificate      /etc/ssl/certs/myssl.crt;
    ssl_certificate_key  /etc/ssl/private/myssl.key;

    server_name local.prizefrenzy.com;

    location /api {
      access_log off;
      proxy_pass https://prizefrenzy.com;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
