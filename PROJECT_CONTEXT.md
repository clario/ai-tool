# Travel Assistant Project Context

## 🎯 Project Overview
We're building an interactive travel assistant that combines a 3D globe visualization with AI-powered conversation to help users plan their trips. The AI will suggest destinations and routes, which will be visualized in real-time on a 3D globe.

## 🏗️ Architecture & Tech Stack

### Frontend Stack
- **Framework**: SvelteKit (Svelte 5)
- **UI Components**: shadcn-svelte + TailwindCSS
- **3D Visualization**: Globe.gl (WebGL-based 3D globe)
- **3D Graphics**: Three.js (dependency of Globe.gl)

### AI Integration
- **AI SDK**: Vercel's `ai` library
- **Provider**: OpenAI (via `@ai-sdk/openai`)
- **Function Calling**: AI will use tools/functions to manipulate the globe

### Additional APIs
- **Weather**: OpenWeatherMap API (for destination weather reports)
- **Routing**: Future integration with Mapbox/OpenRouteService (currently using straight lines)

## 🎨 User Experience Flow

1. **Landing**: User sees a 3D globe at the top of the page
2. **Interaction**: Chat interface below globe for AI conversation
3. **Planning**: AI asks for travel dates and preferences
4. **Visualization**: AI suggests destinations → pins appear on globe
5. **Routing**: AI suggests routes → straight lines connect destinations
6. **Weather**: AI fetches and displays weather for planned dates
7. **Iteration**: User can refine plans through conversation

## 🛠️ Core Components Structure

```
src/
├── components/
│   ├── TravelGlobe.svelte      # 3D globe with pins and routes
│   ├── ChatInterface.svelte    # AI conversation UI
│   ├── MessageList.svelte      # Chat message history
│   ├── WeatherCard.svelte      # Weather display for locations
│   └── TravelPlanner.svelte    # Main orchestrator component
├── lib/
│   ├── ai/
│   │   ├── tools.ts           # AI function definitions
│   │   └── chat.ts            # AI conversation logic
│   ├── globe/
│   │   ├── globe-manager.ts   # Globe state management
│   │   └── types.ts           # Globe data types
│   └── weather/
│       └── weather-api.ts     # Weather API integration
└── routes/
    └── +page.svelte           # Main page with globe + chat
```

## 🤖 AI Function Calling Strategy

The AI will use these tools to interact with the globe:

```typescript
// Example AI tools
const tools = {
  addDestination: {
    description: 'Add a destination pin to the globe',
    parameters: { lat: number, lng: number, name: string, date?: string },
    execute: (params) => updateGlobeState()
  },
  drawRoute: {
    description: 'Draw a route between two or more locations',
    parameters: { waypoints: Array<{lat: number, lng: number}> },
    execute: (params) => updateGlobeRoutes()
  },
  getWeather: {
    description: 'Get weather information for a location on a specific date',
    parameters: { lat: number, lng: number, date: string },
    execute: (params) => fetchWeatherData()
  }
}
```

## 🎯 Key Features

### Phase 1 (MVP)
- ✅ 3D globe with rotation/zoom
- ✅ Pin placement for destinations
- ✅ Straight-line routes between pins
- ✅ Basic AI conversation
- ✅ Weather data for destinations

### Phase 2 (Enhancement)
- 🔄 Real road routing (Mapbox integration)
- 🔄 Route optimization suggestions
- 🔄 Multiple travel modes (driving, flying, train)
- 🔄 Interactive route editing

### Phase 3 (Advanced)
- 🔄 Offline mode with cached data
- 🔄 Collaborative planning (multiple users)
- 🔄 Export to calendar/maps
- 🔄 Cost estimation integration

## 🌍 Globe Visualization Details

### Current Implementation (Straight Lines)
- Globe.gl renders direct arcs between coordinates
- No road-following (acceptable for MVP)
- Pins show destination names and dates
- Routes show as colored arcs/curves

### Future Enhancement (Real Roads)
- Integration with routing APIs
- Road-following path visualization
- Turn-by-turn directions
- Multiple route options

## 🗓️ Development Phases

1. **Setup & Dependencies** - Install Globe.gl, AI SDK, weather API
2. **Basic Globe** - 3D globe with rotation/zoom controls
3. **Pin System** - Add/remove destination pins
4. **Route Drawing** - Connect pins with straight lines
5. **AI Integration** - Function calling to control globe
6. **Chat Interface** - User conversation with AI
7. **Weather Integration** - Display weather for destinations
8. **Polish & UX** - Animations, loading states, error handling

## 🎨 Design Principles

- **Minimalist**: Clean, focused interface
- **Interactive**: Real-time globe updates
- **Conversational**: Natural AI interaction
- **Visual**: Geography-first approach
- **Responsive**: Works on desktop and mobile

## 🔧 Technical Considerations

- **Performance**: Globe.gl is WebGL-optimized
- **State Management**: Svelte stores for globe state
- **API Limits**: Rate limiting for weather/routing APIs
- **Mobile**: Touch controls for globe interaction
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

1. Install dependencies: `pnpm add ai @ai-sdk/openai globe.gl three @types/three`
2. Create basic globe component with Globe.gl
3. Add pin placement functionality
4. Implement straight-line routing
5. Integrate AI SDK with function calling
6. Build chat interface
7. Add weather API integration

## 📝 Current Status

- ✅ Project setup with SvelteKit + shadcn-svelte + TailwindCSS
- 🔄 Ready to add 3D globe dependencies
- 🔄 Ready to implement core components
- 🔄 Ready to integrate AI functionality

---

*This document serves as the single source of truth for project requirements, architecture decisions, and development progress.*
