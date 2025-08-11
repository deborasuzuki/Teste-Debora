<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Tarefa;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TarefaTest extends TestCase
{
    use RefreshDatabase;

    public function test_pode_criar_tarefa()
    {
        $tarefa = Tarefa::create([
            'title' => 'Teste de Tarefa',
            'description' => 'Descrição da tarefa de teste',
            'priority' => 3
        ]);

        $this->assertInstanceOf(Tarefa::class, $tarefa);
        $this->assertEquals('Teste de Tarefa', $tarefa->title);
        $this->assertEquals('Descrição da tarefa de teste', $tarefa->description);
        $this->assertEquals(3, $tarefa->priority);
        $this->assertFalse($tarefa->completed);
        $this->assertEquals(1, $tarefa->priority); // valor padrão
    }

    public function test_pode_atualizar_tarefa()
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa Original',
            'priority' => 1
        ]);

        $tarefa->update([
            'title' => 'Tarefa Atualizada',
            'completed' => true,
            'priority' => 5
        ]);

        $this->assertEquals('Tarefa Atualizada', $tarefa->title);
        $this->assertTrue($tarefa->completed);
        $this->assertEquals(5, $tarefa->priority);
    }

    public function test_pode_deletar_tarefa()
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa para Deletar'
        ]);

        $id = $tarefa->id;
        $tarefa->delete();

        $this->assertDatabaseMissing('tarefas', ['id' => $id]);
    }

    public function test_scopes_funcionam_corretamente()
    {
        // Criar tarefas com diferentes status
        Tarefa::create(['title' => 'Tarefa 1', 'completed' => false]);
        Tarefa::create(['title' => 'Tarefa 2', 'completed' => true]);
        Tarefa::create(['title' => 'Tarefa 3', 'completed' => false]);

        $this->assertEquals(2, Tarefa::active()->count());
        $this->assertEquals(1, Tarefa::completed()->count());
    }

    public function test_scope_by_priority()
    {
        Tarefa::create(['title' => 'Tarefa Baixa', 'priority' => 1]);
        Tarefa::create(['title' => 'Tarefa Alta', 'priority' => 5]);
        Tarefa::create(['title' => 'Tarefa Média', 'priority' => 3]);

        $tarefasPrioridade5 = Tarefa::byPriority(5)->get();
        
        $this->assertEquals(1, $tarefasPrioridade5->count());
        $this->assertEquals('Tarefa Alta', $tarefasPrioridade5->first()->title);
    }

    public function test_casts_funcionam_corretamente()
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa com Casts',
            'completed' => '1', // string que deve ser convertida para boolean
            'priority' => '3'   // string que deve ser convertida para integer
        ]);

        $this->assertIsBool($tarefa->completed);
        $this->assertIsInt($tarefa->priority);
        $this->assertTrue($tarefa->completed);
        $this->assertEquals(3, $tarefa->priority);
    }

    public function test_valores_padrao()
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa com Valores Padrão'
        ]);

        $this->assertFalse($tarefa->completed);
        $this->assertEquals(1, $tarefa->priority);
    }
}
