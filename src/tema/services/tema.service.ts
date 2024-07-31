import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tema } from "../entities/tema.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class TemaService {

  constructor(
    @InjectRepository(Tema)
    private temaRepository: Repository<Tema>
  ) { }

  async findAll(): Promise<Tema[]> {
    return await this.temaRepository.find({
      relations: {
        postagem: true,
      }
    });
  }

  async findById(id: number): Promise<Tema> {
    let buscaTema = await this.temaRepository.findOne({
      where: { id },
      relations: {
        postagem: true,
      }
    });

    if (!buscaTema)
      throw new HttpException("Tema não foi encontrada!", HttpStatus.NOT_FOUND);
    return buscaTema
  }

  async findByDescricao(descricao: string): Promise<Tema[]> {
    return await this.temaRepository.find({
      where: { descricao: ILike(`%${descricao}%`) },
      relations: {
        postagem: true,
      }
    })
  }

  async create(tema: Tema): Promise<Tema> {
    return await this.temaRepository.save(tema);
  }

  async update(tema: Tema): Promise<Tema> {

    await this.findById(tema.id);

    if (!tema.id)
      throw new HttpException("É necessário passar o ID do tema!", HttpStatus.NOT_FOUND)

    return await this.temaRepository.save(tema);
  }

  async delete(id: number): Promise<DeleteResult> {

    await this.findById(id);

    return await this.temaRepository.delete(id);
  }
}