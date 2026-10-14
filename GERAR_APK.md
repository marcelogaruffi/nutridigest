# Como gerar o APK (NutriDigest)

## Pré-requisitos
- Node.js 20+ e **JDK 21** (o Android Studio já traz um JDK 21)
- Android Studio (instala o Android SDK 36)

## IMPORTANTE
Coloque o projeto numa pasta **sem acentos nem espaços**, ex.: `C:\nutridigest`.
Pasta como `C:\Nutrição` costuma quebrar o build do Gradle.

## Passos
1. Na pasta do projeto:
   ```
   npm install
   npm run build
   npx cap sync android
   ```
2. `npx cap open android` (abre no Android Studio; espere o Gradle sincronizar)
3. Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. APK em `android/app/build/outputs/apk/debug/app-debug.apk`
5. Copie pro celular e instale (permita "fontes desconhecidas").

Sempre que mudar o código: `npm run build && npx cap sync android` e gere de novo.

## Pelo terminal (opcional)
```
cd android
gradlew assembleDebug      (Windows)
./gradlew assembleDebug    (Mac/Linux)
```
