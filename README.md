# Handsontable Test Project

## Overview
A web application with spreadsheet functionality that allows resizing of rows and columns with automatic data persistence.

## Features
- 10x10 spreadsheet display
- Adjustable column widths and row heights
- Automatic data saving and loading
- Persistent spreadsheet state (maintained after page refresh)

## Tech Stack
- **Frontend**: Vue 3, Handsontable
- **Backend**: NestJS
- **Database**: SQLite
- **Build Tool**: Turborepo

## Getting Started
1. Install dependencies: `pnpm install`
2. Run development servers: `pnpm dev`
3. Open in browser: `http://localhost:5173`

## Notes
- Data is automatically saved to an SQLite database
- Backend API runs on `http://localhost:3000` 