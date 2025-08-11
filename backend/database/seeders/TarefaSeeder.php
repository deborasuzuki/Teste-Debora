<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tarefa;

class TarefaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tarefas = [
            [
                'title' => 'Configurar ambiente de desenvolvimento',
                'description' => 'Instalar e configurar todas as ferramentas necessárias para o desenvolvimento',
                'priority' => 5,
                'completed' => true,
                'due_date' => now()->subDays(2)
            ],
            [
                'title' => 'Criar estrutura do banco de dados',
                'description' => 'Desenvolver as migrations e seeders para o projeto',
                'priority' => 4,
                'completed' => true,
                'due_date' => now()->subDay()
            ],
            [
                'title' => 'Implementar autenticação de usuários',
                'description' => 'Criar sistema de login e registro com Laravel Sanctum',
                'priority' => 3,
                'completed' => false,
                'due_date' => now()->addDays(3)
            ],
            [
                'title' => 'Desenvolver testes unitários',
                'description' => 'Criar testes para todos os métodos dos controllers e services',
                'priority' => 4,
                'completed' => false,
                'due_date' => now()->addDays(5)
            ],
            [
                'title' => 'Implementar validação de dados',
                'description' => 'Adicionar validação robusta para todas as entradas da API',
                'priority' => 3,
                'completed' => true,
                'due_date' => now()
            ],
            [
                'title' => 'Configurar CORS adequadamente',
                'description' => 'Implementar configuração segura de CORS para comunicação com frontend',
                'priority' => 2,
                'completed' => false,
                'due_date' => now()->addDays(1)
            ],
            [
                'title' => 'Documentar API',
                'description' => 'Criar documentação completa da API com exemplos de uso',
                'priority' => 2,
                'completed' => false,
                'due_date' => now()->addDays(7)
            ],
            [
                'title' => 'Implementar logging e monitoramento',
                'description' => 'Adicionar sistema de logs e monitoramento para produção',
                'priority' => 1,
                'completed' => false,
                'due_date' => now()->addDays(10)
            ]
        ];

        foreach ($tarefas as $tarefa) {
            Tarefa::create($tarefa);
        }

        $this->command->info('Tarefas iniciais criadas com sucesso!');
    }
}
