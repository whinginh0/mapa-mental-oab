FROM nginx:alpine

# Remove arquivos padrao do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos da aplicacao para o diretorio do nginx
COPY . /usr/share/nginx/html

# Copia a configuracao otimizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expoe a porta 80 padrao do EasyPanel
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
