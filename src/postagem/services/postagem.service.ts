import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TemaService } from "../../tema/services/tema.service";

@Injectable()
export class PostagemService {

  constructor(
    @InjectRepository(Postagem)
    private postagemRepository: Repository<Postagem>,
    private temaService: TemaService
  ) { }

  async findAll(): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      relations: {
        tema: true,
        usuario: true
      }
    });
  }

  async findById(id: number): Promise<Postagem> {
    let buscaPostagem = await this.postagemRepository.findOne({
      where: { id },
      relations: {
        tema: true,
        usuario: true
      }
    });

    if (!buscaPostagem) {
      throw new HttpException("Postagem não foi encontrada!", HttpStatus.NOT_FOUND);
    }
    return buscaPostagem;
  }

  async findByTitulo(titulo: string): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      where: { titulo: ILike(`%${titulo}%`) },
      relations: {
        tema: true,
        usuario: true
      }
    })
  }

  async findByTexto(texto: string): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      where: { texto: ILike(`%${texto}%`) },
      relations: {
        tema: true,
        usuario: true
      }
    })
  }

  async create(postagem: Postagem): Promise<Postagem> {
    if (postagem.tema) {
      await this.temaService.findById(postagem.tema.id)

      return await this.postagemRepository.save(postagem);
    }
    return await this.postagemRepository.save(postagem);
  }

  async update(postagem: Postagem): Promise<Postagem> {

    await this.findById(postagem.id);

    if (!postagem.id) {
      throw new HttpException("É necessário passar o ID da postagem a ser atualizada!", HttpStatus.NOT_FOUND)
    }

    if (postagem.tema) {
      await this.temaService.findById(postagem.tema.id)

      return await this.postagemRepository.save(postagem);
    }
    return await this.postagemRepository.save(postagem);
  }

  async delete(id: number): Promise<DeleteResult> {

    let buscaPostagem = await this.findById(id);

    if (!buscaPostagem) {
      throw new HttpException("Postagem não foi encontrada!", HttpStatus.NOT_FOUND);
    }

    return await this.postagemRepository.delete(id);
  }
}