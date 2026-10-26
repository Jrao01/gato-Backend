import type { Person } from "@prisma/client";
import { PersonRepository } from "../repositories/person.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreatePersonInput, UpdatePersonInput } from "../models/person.model.js";

export class PersonService {
  constructor(private readonly repository: PersonRepository = new PersonRepository()) {}

  async list(): Promise<Person[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<Person> {
    const person = await this.repository.findById(id);
    if (!person) throw new NotFoundError("Persona");
    return person;
  }

  async create(input: CreatePersonInput): Promise<Person> {
    const existing = await this.repository.findByCi(input.ci);
    if (existing) throw new ConflictError("Ya existe una persona con esa cédula");
    return this.repository.create(input);
  }

  async update(id: string, input: UpdatePersonInput): Promise<Person> {
    await this.getById(id);
    if (input.ci) {
      const existing = await this.repository.findByCi(input.ci);
      if (existing && existing.id !== id) {
        throw new ConflictError("Ya existe una persona con esa cédula");
      }
    }
    return this.repository.update(id, input);
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
