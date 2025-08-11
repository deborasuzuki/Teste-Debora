<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Tarefa;
use App\Services\TarefaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;

class TarefaServiceTest extends TestCase
{
    use RefreshDatabase;

    private TarefaService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TarefaService();
    }

    public function test_pode_listar_tarefas_com_filtros()
    {
        // Criar tarefas com diferentes características
        Tarefa::create(['title' => 'Tarefa Alta', 'priority' => 5, 'completed' => false]);
        Tarefa::create(['title' => 'Tarefa Baixa', 'priority' => 1, 'completed' => true]);
        Tarefa::create(['title' => 'Tarefa Média', 'priority' => 3, 'completed' => false]);

        $resultado = $this->service->listarTarefas(['priority' => 5]);

        $this->assertInstanceOf(LengthAwarePaginator::class, $resultado);
        $this->assertEquals(1, $resultado->count());
        $this->assertEquals('Tarefa Alta', $resultado->first()->title);
    }

    public function test_pode_criar_tarefa()
    {
        $dados = [
            'title' => 'Nova Tarefa via Service',
            'description' => 'Descrição da tarefa',
            'priority' => 4
        ];

        $tarefa = $this->service->criarTarefa($dados);

        $this->assertInstanceOf(Tarefa::class, $tarefa);
        $this->assertEquals('Nova Tarefa via Service', $tarefa->title);
        $this->assertEquals(4, $tarefa->priority);
        $this->assertDatabaseHas('tarefas', $dados);
    }

    public function test_pode_atualizar_tarefa()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa Original']);

        $dados = [
            'title' => 'Tarefa Atualizada via Service',
            'completed' => true
        ];

        $resultado = $this->service->atualizarTarefa($tarefa->id, $dados);

        $this->assertEquals('Tarefa Atualizada via Service', $resultado->title);
        $this->assertTrue($resultado->completed);
    }

    public function test_pode_deletar_tarefa()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa para Deletar']);

        $resultado = $this->service->deletarTarefa($tarefa->id);

        $this->assertTrue($resultado);
        $this->assertDatabaseMissing('tarefas', ['id' => $tarefa->id]);
    }

    public function test_pode_alternar_status()
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa Pendente', 'completed' => false]);

        $resultado = $this->service->alternarStatus($tarefa->id);

        $this->assertTrue($resultado->completed);

        // Alternar novamente
        $resultado = $this->service->alternarStatus($tarefa->id);
        $this->assertFalse($resultado->completed);
    }

    public function test_pode_obter_estatisticas()
    {
        Tarefa::create(['title' => 'Tarefa 1', 'completed' => false]);
        Tarefa::create(['title' => 'Tarefa 2', 'completed' => true]);
        Tarefa::create(['title' => 'Tarefa 3', 'completed' => false]);

        $estatisticas = $this->service->obterEstatisticas();

        $this->assertIsArray($estatisticas);
        $this->assertEquals(3, $estatisticas['total']);
        $this->assertEquals(1, $estatisticas['concluidas']);
        $this->assertEquals(2, $estatisticas['pendentes']);
        $this->assertEquals(33.33, $estatisticas['percentual_concluido']);
    }

    public function test_pode_buscar_tarefas()
    {
        Tarefa::create(['title' => 'Tarefa de Desenvolvimento']);
        Tarefa::create(['title' => 'Tarefa de Teste']);
        Tarefa::create(['title' => 'Outra Tarefa']);

        $resultado = $this->service->buscarTarefas('desenvolvimento');

        $this->assertEquals(1, $resultado->count());
        $this->assertEquals('Tarefa de Desenvolvimento', $resultado->first()->title);
    }

    public function test_busca_case_insensitive()
    {
        Tarefa::create(['title' => 'Tarefa IMPORTANTE']);

        $resultado = $this->service->buscarTarefas('importante');

        $this->assertEquals(1, $resultado->count());
        $this->assertEquals('Tarefa IMPORTANTE', $resultado->first()->title);
    }

    public function test_filtros_multiplos()
    {
        Tarefa::create(['title' => 'Tarefa 1', 'priority' => 5, 'completed' => false]);
        Tarefa::create(['title' => 'Tarefa 2', 'priority' => 5, 'completed' => true]);
        Tarefa::create(['title' => 'Tarefa 3', 'priority' => 1, 'completed' => false]);

        $filtros = [
            'priority' => 5,
            'completed' => false
        ];

        $resultado = $this->service->listarTarefas($filtros);

        $this->assertEquals(1, $resultado->count());
        $this->assertEquals('Tarefa 1', $resultado->first()->title);
    }

    public function test_ordenacao_personalizada()
    {
        Tarefa::create(['title' => 'Tarefa A', 'priority' => 1]);
        Tarefa::create(['title' => 'Tarefa B', 'priority' => 5]);
        Tarefa::create(['title' => 'Tarefa C', 'priority' => 3]);

        $filtros = [
            'order_by' => 'priority',
            'direction' => 'desc'
        ];

        $resultado = $this->service->listarTarefas($filtros);

        $this->assertEquals('Tarefa B', $resultado->first()->title);
        $this->assertEquals(5, $resultado->first()->priority);
    }
}
