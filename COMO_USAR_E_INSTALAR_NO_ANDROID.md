# NutriDigest - Diário Alimentar & Controle de Sintomas Intestinais

Aplicativo desenvolvido sob medida para investigar causas de **diarreia**, **gases (pum e arrotos)** e **cólicas abdominais**, identificando se os sintomas decorrem de refeições recentes (de hoje) ou de fermentação tardia (do dia anterior).

---

## 📱 1. Como Usar e Instalar no seu Celular Android AGORA (Em 1 Minuto)

O servidor já está ativo no seu computador! Siga estes passos simples:

1. Conecte o seu celular Android na **mesma rede Wi-Fi** do seu computador.
2. No celular, abra o **Google Chrome** e acesse o endereço:
   👉 **`http://192.168.0.14:5173`**
3. No topo direito do Chrome no celular, toque nos **3 pontinhos (⋮)**.
4. Selecione **"Instalar aplicativo"** (ou *"Adicionar à tela inicial"*).
5. **Pronto!** O Android criará o ícone do **NutriDigest** na tela e gaveta de apps do seu celular:
   - Abre em tela cheia (sem barra de navegador).
   - Funciona **100% offline** (mesmo sem internet).
   - Seus dados de saúde ficam salvos com total privacidade no seu aparelho.

---

## 🔬 2. Funcionalidades Clínicas Incluídas

### 🍽️ Diário Alimentar
- Registro do horário e tipo de refeição (Café, Almoço, Lanche, Jantar, Bebida, etc.).
- Botões de seleção rápida para os maiores vilões gastrointestinais:
  - **Lactose / Leite e Queijos**
  - **Glúten / Trigo e Pães**
  - **Feijões / Leguminosas (FODMAPs)**
  - **Café, Frituras, Carnes Vermelhas, Bebidas com gás**
  - **Cebola / Alho (altamente fermentáveis no cólon)**

### ⚠️ Registro de Sintomas Focado no seu Pedido
- **A Pergunta Chave:** *De onde você suspeita que veio esse sintoma?*
  - ⚡ **De HOJE:** Reação rápida de digestão alta (arrotos, azia, refluxo, intolerância precoce).
  - 🔄 **Do DIA ANTERIOR (ONTEM):** Fermentação no intestino grosso (diarreia matinal, gases fortes e cólicas cólicas de 12h a 36h após a refeição).
  - ❓ **Não sei ao certo:** O app investiga ambas as janelas.
- **Diarreia:** Classificação médica pela Escala de Bristol (Tipo 5, 6 pastoso ou 7 líquido), contagem de idas ao banheiro e registro de urgência.
- **Gases:** Diferenciação entre *Pum* (odor forte, gases presos causando dor) e *Arrotos* (frequentes após comer, gosto azedo/refluxo).
- **Cólicas:** Nível de dor de 1 a 10, localização (pé da barriga/baixo ventre, estômago, laterais) e tipo de dor (pontada, espasmo, aperto).

### 🔍 Aba "Gatilhos & Investigação"
- Algoritmo que correlaciona os horários das suas refeições com as crises.
- Mostra um ranking com porcentagem de probabilidade para cada ingrediente que você consumiu antes de passar mal.

### 📋 Relatório para o Médico / WhatsApp
- Resumo estruturado dos últimos 7, 14 ou 30 dias.
- **Botão "Copiar para WhatsApp":** Formata uma mensagem perfeita com tópicos e estatísticas para colar na conversa com o médico.
- **Botão "Imprimir / PDF":** Gera uma folha A4 limpa para levar na consulta.

### 📅 Calendário Mensal
- Bolinhas coloridas para cada dia:
  - 🟢 **Verde:** Dia tranquilo e digestão ótima.
  - 🟡 **Amarelo:** Gases ou desconforto leve.
  - 🔴 **Vermelho:** Episódio de diarreia ou cólica severa.

---

## 📦 3. Se você desejar o arquivo `.APK` físico

O projeto já está 100% configurado com o **Capacitor** na pasta `android/`.
Caso você queira gerar o arquivo `.apk` físico:
1. **Pelo PWABuilder (Nuvem em 1 clique - Grátis da Microsoft):**
   - Acesse [pwabuilder.com](https://www.pwabuilder.com)
   - Digite a URL do seu app (após subir na Vercel ou Netlify em segundos) e baixe o APK pronto.
2. **Pelo Android Studio:**
   - Abra a pasta `c:\Nutrição\android` no Android Studio.
   - Vá no menu superior: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
   - O arquivo `app-debug.apk` será gerado na pasta `android/app/build/outputs/apk/debug/`.
