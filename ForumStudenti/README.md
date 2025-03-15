# Forum Studenti - Blazor WebAssembly

Un'applicazione web moderna per la condivisione di materiali didattici e discussioni tra studenti, implementata con Blazor WebAssembly.

## Caratteristiche

### Forum
- Creazione e gestione di discussioni
- Categorizzazione dei post
- Sistema di like e risposte
- Ricerca e filtri per categoria

### File Share
- Navigazione struttura cartelle
- Anteprima dei file
- Upload e download simulati
- Supporto per vari tipi di file

## Tecnologie Utilizzate

- .NET 6
- Blazor WebAssembly
- Tailwind CSS
- Font Awesome
- Google Fonts

## Prerequisiti

- .NET 6 SDK
- Un IDE moderno (Visual Studio 2022, VS Code, ecc.)

## Come Iniziare

1. Clona il repository:
```bash
git clone https://github.com/yourusername/forum-studenti.git
```

2. Naviga nella directory del progetto:
```bash
cd forum-studenti
```

3. Ripristina i pacchetti NuGet:
```bash
dotnet restore
```

4. Avvia l'applicazione:
```bash
dotnet run
```

5. Apri il browser e visita:
```
https://localhost:5001
```

## Struttura del Progetto

```
ForumStudenti/
├── Pages/              # Componenti Razor delle pagine
│   ├── Forum.razor
│   ├── FileShare.razor
│   └── Index.razor
├── Shared/            # Componenti condivisi
│   └── MainLayout.razor
├── Models/            # Classi dei modelli
│   ├── Post.cs
│   └── FileItem.cs
├── Services/          # Servizi dell'applicazione
│   ├── ForumService.cs
│   └── FileService.cs
├── wwwroot/          # File statici
│   └── index.html
├── App.razor         # Componente radice
└── Program.cs        # Punto di ingresso
```

## Funzionalità Principali

### Forum
- Visualizzazione e creazione di discussioni
- Filtro per categoria
- Sistema di ricerca
- Like e risposte ai post

### File Share
- Visualizzazione gerarchica dei file
- Preview dei file
- Download simulato
- Caricamento file (simulato)

## Contribuire

Le pull request sono benvenute. Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

## Licenza

[MIT](https://choosealicense.com/licenses/mit/)
