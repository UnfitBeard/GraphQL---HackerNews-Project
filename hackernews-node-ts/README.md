# HackerNews GraphQL API

This is a **HackerNews GraphQL API** that I built as part of my personal practice and learning. It allows users to interact with HackerNews data using **GraphQL queries** and **mutations**.

### Features:
- **Fetch news stories**: Retrieve the latest news, articles, and discussions.
- **Post new stories**: Add new stories to the database.
- **Upvote stories**: Upvote stories to increase their visibility.
- **Search stories**: Search for stories based on keywords or topics.

### Technologies Used:
- **GraphQL**: API query language for interacting with the data.
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework to set up the API server.
- **Prisma ORM**: Database toolkit used to interact with the database.
- **Redis**: In-memory data store for caching frequently accessed data.

### Setup Instructions:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/hackernews-graphql-api.git
   ```

2. **Install dependencies**:
   Navigate to the project folder and install the required dependencies:
   ```bash
   cd hackernews-graphql-api
   npm install
   ```

3. **Set up the database**:
   Make sure to configure your **Prisma** database and run migrations to set up the schema:
   ```bash
   npx prisma migrate dev
   ```

4. **Start the server**:
   Once everything is set up, you can start the API server:
   ```bash
   npm start
   ```

   The server will be running on `http://localhost:Your Port Number on the index.ts`.

### API Endpoints:
- **GraphQL Playground**: Access the GraphQL Playground at `http://localhost:PORT` for testing queries and mutations.
- **Queries**:
  - `stories`: Get a list of stories.
  - `story(id: ID!)`: Get details of a specific story by its ID.
- **Mutations**:
  - `createStory`: Add a new story.
  - `upvoteStory`: Upvote a story to increase its ranking.
