-- Seed data for Inclusio Evaluations
-- Inserting predefined applications, types, and flows

-- Insert Application Types
INSERT INTO application_types (name) VALUES
('Aplicativo Mobile'),
('Software'),
('Web');

-- Insert Applications (without type field)
INSERT INTO applications (name, link) VALUES
('WhatsApp', 'https://www.whatsapp.com/'),
('Netflix', 'https://www.netflix.com/'),
('MercadoLivre', 'https://www.mercadolivre.com.br/'),
('iFood', 'https://www.ifood.com.br/'),
('Instagram', 'https://www.instagram.com/'),
('Spotify', 'https://www.spotify.com/br/'),
('Google Maps', 'https://www.google.com/maps'),
('Uber', 'https://www.uber.com/br/'),
('Nubank', 'https://nubank.com.br/'),
('Microsoft Teams', 'https://www.microsoft.com/pt-br/microsoft-teams/'),
('Zoom', 'https://zoom.us/'),
('Notion', 'https://www.notion.so/'),
('LinkedIn', 'https://www.linkedin.com/'),
('GitHub', 'https://github.com/'),
('Figma', 'https://www.figma.com/');

-- Link Applications to Types
-- WhatsApp (Mobile, Web, Software)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM application_types WHERE name = 'Software'));

-- Netflix (Web, Mobile)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile'));

-- MercadoLivre (Web, Mobile)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile'));

-- iFood (Mobile, Web)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM application_types WHERE name = 'Web'));

-- Instagram (Mobile, Web)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM application_types WHERE name = 'Web'));

-- Spotify (Mobile, Web, Software)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM application_types WHERE name = 'Software'));

-- Google Maps (Mobile, Web)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Google Maps'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'Google Maps'), (SELECT id FROM application_types WHERE name = 'Web'));

-- Uber (Mobile, Web)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM application_types WHERE name = 'Web'));

-- Nubank (Mobile, Web)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM application_types WHERE name = 'Web'));

-- Microsoft Teams (Software, Web, Mobile)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM application_types WHERE name = 'Software')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile'));

-- Zoom (Software, Web, Mobile)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM application_types WHERE name = 'Software')),
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile'));

-- Notion (Web, Mobile, Software)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile')),
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM application_types WHERE name = 'Software'));

-- LinkedIn (Web, Mobile)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM application_types WHERE name = 'Aplicativo Mobile'));

-- GitHub (Web, Software)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM application_types WHERE name = 'Software'));

-- Figma (Web, Software)
INSERT INTO application_application_types (application_id, application_type_id) VALUES
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM application_types WHERE name = 'Web')),
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM application_types WHERE name = 'Software'));

-- Insert Flows (common flows for accessibility evaluation)
INSERT INTO flows (name, description) VALUES
('Login e Autenticação', 'Processo de login, registro e recuperação de senha'),
('Busca e Filtros', 'Funcionalidade de busca e aplicação de filtros'),
('Navegação Principal', 'Menu principal, navegação entre páginas e seções'),
('Formulários', 'Preenchimento e submissão de formulários'),
('Listagem de Itens', 'Visualização de listas, grids e catálogos'),
('Detalhes do Produto/Serviço', 'Página de detalhes de um item específico'),
('Carrinho de Compras', 'Adição, remoção e finalização de compras'),
('Perfil do Usuário', 'Visualização e edição de informações do perfil'),
('Configurações', 'Acesso e modificação de configurações da aplicação'),
('Notificações', 'Visualização e gerenciamento de notificações'),
('Upload de Arquivos', 'Envio e gerenciamento de arquivos'),
('Chat e Mensagens', 'Envio e recebimento de mensagens'),
('Reprodução de Mídia', 'Reprodução de vídeos, áudios ou imagens'),
('Compartilhamento', 'Compartilhamento de conteúdo'),
('Pagamento', 'Processo de pagamento e checkout');

-- Link Applications to Flows
-- WhatsApp
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM flows WHERE name = 'Chat e Mensagens')),
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário')),
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM flows WHERE name = 'Configurações')),
((SELECT id FROM applications WHERE name = 'WhatsApp'), (SELECT id FROM flows WHERE name = 'Compartilhamento'));

-- Netflix
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM flows WHERE name = 'Listagem de Itens')),
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM flows WHERE name = 'Reprodução de Mídia')),
((SELECT id FROM applications WHERE name = 'Netflix'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário'));

-- MercadoLivre
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Listagem de Itens')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Detalhes do Produto/Serviço')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Carrinho de Compras')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Pagamento')),
((SELECT id FROM applications WHERE name = 'MercadoLivre'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário'));

-- iFood
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Listagem de Itens')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Detalhes do Produto/Serviço')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Carrinho de Compras')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Pagamento')),
((SELECT id FROM applications WHERE name = 'iFood'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário'));

-- Instagram
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM flows WHERE name = 'Listagem de Itens')),
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM flows WHERE name = 'Upload de Arquivos')),
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário')),
((SELECT id FROM applications WHERE name = 'Instagram'), (SELECT id FROM flows WHERE name = 'Compartilhamento'));

-- Spotify
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM flows WHERE name = 'Listagem de Itens')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM flows WHERE name = 'Reprodução de Mídia')),
((SELECT id FROM applications WHERE name = 'Spotify'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário'));

-- Google Maps
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Google Maps'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Google Maps'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'Google Maps'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Google Maps'), (SELECT id FROM flows WHERE name = 'Configurações'));

-- Uber
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM flows WHERE name = 'Formulários')),
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM flows WHERE name = 'Pagamento')),
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário')),
((SELECT id FROM applications WHERE name = 'Uber'), (SELECT id FROM flows WHERE name = 'Notificações'));

-- Nubank
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Formulários')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Pagamento')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Configurações')),
((SELECT id FROM applications WHERE name = 'Nubank'), (SELECT id FROM flows WHERE name = 'Notificações'));

-- Microsoft Teams
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM flows WHERE name = 'Chat e Mensagens')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM flows WHERE name = 'Upload de Arquivos')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM flows WHERE name = 'Reprodução de Mídia')),
((SELECT id FROM applications WHERE name = 'Microsoft Teams'), (SELECT id FROM flows WHERE name = 'Configurações'));

-- Zoom
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM flows WHERE name = 'Formulários')),
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM flows WHERE name = 'Reprodução de Mídia')),
((SELECT id FROM applications WHERE name = 'Zoom'), (SELECT id FROM flows WHERE name = 'Configurações'));

-- Notion
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM flows WHERE name = 'Formulários')),
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM flows WHERE name = 'Upload de Arquivos')),
((SELECT id FROM applications WHERE name = 'Notion'), (SELECT id FROM flows WHERE name = 'Busca e Filtros'));

-- LinkedIn
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM flows WHERE name = 'Formulários')),
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário')),
((SELECT id FROM applications WHERE name = 'LinkedIn'), (SELECT id FROM flows WHERE name = 'Notificações'));

-- GitHub
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM flows WHERE name = 'Busca e Filtros')),
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM flows WHERE name = 'Upload de Arquivos')),
((SELECT id FROM applications WHERE name = 'GitHub'), (SELECT id FROM flows WHERE name = 'Perfil do Usuário'));

-- Figma
INSERT INTO application_flows (application_id, flow_id) VALUES
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM flows WHERE name = 'Login e Autenticação')),
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM flows WHERE name = 'Navegação Principal')),
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM flows WHERE name = 'Upload de Arquivos')),
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM flows WHERE name = 'Compartilhamento')),
((SELECT id FROM applications WHERE name = 'Figma'), (SELECT id FROM flows WHERE name = 'Configurações'));
