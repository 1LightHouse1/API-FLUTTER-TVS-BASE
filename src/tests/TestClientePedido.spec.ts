const request = require("supertest");
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Request, Response } from "express";
import { Cliente } from "../models/Cliente";
import { Pedido } from "../models/Pedido";

describe("Integração Cliente e Pedido", () =>{
    let pedidoId: number;
    let clienteId: number;

    beforeAll(async () => {
        const cliente = await Cliente.create({
        nome: "Cliente Teste",
        sobrenome: "Sobrenome Teste",
        cpf: "12345678900"
    });

    clienteId = cliente.id;

    });

    it("Criar um pedido para um cliente e verificar se o pedido está associado corretamente ao cliente.", async () =>{
        const novoPedido = {
            data: "2024-08-28",
            id_cliente: clienteId
        };

        const response = await request(app).post("/incluirPedido").send(novoPedido);

        pedidoId = response.body.id;

        const response2 = await request(app).get(`/pedidos/${pedidoId}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id_cliente");
        expect(response.body.id_cliente).toBe(clienteId);

    });

    it("Recuperar o cliente e verificar os pedidos associados manualmente", async () => {
        const cliente = await Cliente.findByPk(clienteId);
    
        expect(cliente).not.toBeNull();
    
        const pedido = await Pedido.findOne({ where: { id_cliente: clienteId } });
    
        expect(pedido).not.toBeNull();
    
        expect(pedido!.data.toDateString()).toBe(new Date("2024-08-28").toDateString());
    });
    

    afterAll(async () => {
        if (pedidoId) {
          await Pedido.destroy({ where: { id: pedidoId } });
        }
        if (clienteId) {
          await Cliente.destroy({ where: { id: clienteId } });
        }
    });
});