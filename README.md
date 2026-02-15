## Tech Stack

Built this with:

- **Angular 20** - Yeah, using the latest version
- **Angular Material** - For the nice UI components
- **Angular CDK** - For the drag-and-drop magic
- **TypeScript** - Because type safety is nice

### Prerequisites

You'll need Node.js installed. That's pretty much it.

### Installation

Clone this repo and install dependencies:

```bash
cd form-builder
npm install
```

### Running Locally

Just run:

```bash
npm start
```

Then open `http://localhost:4200` in your browser. The app will automatically reload when you make changes.

### Building for Production

When you're ready to deploy:

```bash
npm run build
```

Build files will be in the `dist/` folder.

## How It Works

The app has a few main components:

- **CommonLayout** - The main container that manages all your pages
- **Pages** - Each page can have questions and/or sections
- **Sections** - Groups of related questions (you can even nest sections!)
- **Questions** - The actual form fields

Everything's drag-and-droppable, so you can move questions between sections or even between pages.

### Smart Question Creation

When you're editing a question and hit Enter, it automatically creates a new one right below. Saves a ton of time.

### Keyboard Shortcuts

- `Ctrl/Cmd + C` - Copy selected questions
- `Ctrl/Cmd + V` - Paste questions
- Click + drag to move stuff around

### Multi-Select

Hold `Ctrl` (or `Cmd` on Mac) and click multiple questions to select them all at once. Then you can copy, paste, or drag them as a group.

### Sections Within Sections

You can nest sections inside other sections. Great for complex forms that need multiple levels of organization.

## Project Structure

```
src/app/
├── components/
│   ├── common-layout/   # Main app container
│   ├── pages/           # Page component
│   ├── question/        # Question component
│   └── section/         # Section component
├── services/
│   ├── commonService.ts        # Factory methods for creating questions/sections
│   └── DragDropServices.ts     # Drag and drop logic
└── helpers/
    ├── interfaces.ts            # TypeScript interfaces
    └── common-accordion/        # Reusable accordion component
```

## Development Notes

### Common Service

Instead of having the same code to create empty questions and sections scattered everywhere, it's all in one place now. Makes maintenance way easier.

### Drag and Drop

The drag-and-drop uses Angular CDK's drag-drop module. Had to register each drop list and connect them all so you can move questions between any container. Took some time to get right but works smoothly now.
