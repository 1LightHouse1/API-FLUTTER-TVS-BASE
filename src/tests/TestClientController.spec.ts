const request = require('supertest');
import * as server from '../server';
import { Request, Response } from 'express';

describe('Teste da rota getClientById', () =>{
    it('Deve retornar o cliente quando o ID é válido', async () =>{
        const clienteId = 1;

        const response = await request(app).get(`/clientes/${clienteId}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', clienteId);
    
    });

    it('Deve retornar um 404 quando o cliente não existe', async () =>{
        const clienteId = 999;

        const response = await request(app).get(`/clientes/${clienteId}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Cliente não encontrado');
    
    });
})