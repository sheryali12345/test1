export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Entry {
  id: string;
  userId: string;
  date: string;
  name: string;
  type: string;
  amount: string;
  credit: string;
  debit: string;
}

class Database {
  private static instance: Database;
  private users: User[] = [];
  private entries: { [userId: string]: Entry[] } = {};

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async addUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async getEntries(userId: string): Promise<Entry[]> {
    return this.entries[userId] || [];
  }

  async addEntry(entry: Entry): Promise<void> {
    if (!this.entries[entry.userId]) {
      this.entries[entry.userId] = [];
    }
    this.entries[entry.userId].push(entry);
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.users.find(user => user.id === userId);
  }
}

export default Database.getInstance();