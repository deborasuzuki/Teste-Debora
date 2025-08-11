<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Tarefa;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TarefaControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_pode_listar_tarefas()
    {
        // Criar algumas tarefas
        Tarefa::create(['title' => 'Tarefa 1']);
        Tarefa::create(['title' => 'Tarefa 2']);

        $response = $this->getJson('/api/tarefas');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => ['id', 'title', 'completed', 'priority']
                    ],
                    'pagination'
                ])
                ->assertJson(['success' => true]);
    }

    public function test_pode_criar_tarefa()
    {
        $dados = [
            'title' => 'Nova Tarefa',
            'description' => 'Descrição da nova tarefa',
            'priority' => 4
        ];

        $response = $this->postJson('/api/tarefas', $dados);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => ['id', 'title', 'description', 'priority', 'completed']
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Tarefa criada com sucesso'
                ]);

        $this->assertDatabaseHas('tarefas', [
            'title' => 'Nova Tarefa',
            'priority' => 4
        ]);
    }

    public function test_validacao_ao_criar_tarefa()
    {
        $response = $this->postJson('/api/tarefas', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['title']);
    }

    public function test_pode_mostrar_tarefa_especifica()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa Específica']);

        $response = $this->getJson("/api/tarefas/{$tarefa->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $tarefa->id,
                        'title' => 'Tarefa Específica'
                    ]
                ]);
    }

    public function test_retorna_404_para_tarefa_inexistente()
    {
        $response = $this->getJson('/api/tarefas/999');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Tarefa não encontrada'
                ]);
    }

    public function test_pode_atualizar_tarefa()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa Original']);

        $dados = [
            'title' => 'Tarefa Atualizada',
            'completed' => true
        ];

        $response = $this->putJson("/api/tarefas/{$tarefa->id}", $dados);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Tarefa atualizada com sucesso'
                ]);

        $this->assertDatabaseHas('tarefas', [
            'id' => $tarefa->id,
            'title' => 'Tarefa Atualizada',
            'completed' => true
        ]);
    }

    public function test_pode_deletar_tarefa()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa para Deletar']);

        $response = $this->deleteJson("/api/tarefas/{$tarefa->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Tarefa deletada com sucesso'
                ]);

        $this->assertDatabaseMissing('tarefas', ['id' => $tarefa->id]);
    }

    public function test_pode_alternar_status_tarefa()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa Pendente']);

        $response = $this->patchJson("/api/tarefas/{$tarefa->id}/toggle");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Status da tarefa alterado com sucesso'
                ]);

        $this->assertDatabaseHas('tarefas', [
            'id' => $tarefa->id,
            'completed' => true
        ]);
    }

    public function test_filtros_funcionam_corretamente()
    {
        Tarefa::create(['title' => 'Tarefa Ativa', 'completed' => false]);
        Tarefa::create(['title' => 'Tarefa Concluída', 'completed' => true]);

        $response = $this->getJson('/api/tarefas?completed=false');

        $response->assertStatus(200)
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.title', 'Tarefa Ativa');
    }

    public function test_busca_funciona_corretamente()
    {
        Tarefa::create(['title' => 'Tarefa de Desenvolvimento']);
        Tarefa::create(['title' => 'Tarefa de Teste']);

        $response = $this->getJson('/api/buscar/desenvolvimento');

        $response->assertStatus(200)
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.title', 'Tarefa de Desenvolvimento');
    }

    public function test_estatisticas_funcionam()
    {
        Tarefa::create(['title' => 'Tarefa 1', 'completed' => false]);
        Tarefa::create(['title' => 'Tarefa 2', 'completed' => true]);

        $response = $this->getJson('/api/estatisticas');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => ['total', 'concluidas', 'pendentes', 'atrasadas', 'percentual_concluido']
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'total' => 2,
                        'concluidas' => 1,
                        'pendentes' => 1
                    ]
                ]);
    }
}
