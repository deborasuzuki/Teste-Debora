<?php

namespace App\Services;

use App\Models\Tarefa;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TarefaService
{
    /**
     * Listar tarefas com filtros e paginação
     */
    public function listarTarefas(array $filtros = [], int $perPage = 15): LengthAwarePaginator
    {
        try {
            $query = Tarefa::query();

            // Aplicar filtros
            if (isset($filtros['completed'])) {
                $query->where('completed', $filtros['completed']);
            }

            if (isset($filtros['priority'])) {
                $query->where('priority', $filtros['priority']);
            }

            if (isset($filtros['search'])) {
                $query->where(function($q) use ($filtros) {
                    $q->where('title', 'like', '%' . $filtros['search'] . '%')
                      ->orWhere('description', 'like', '%' . $filtros['search'] . '%');
                });
            }

            // Ordenação
            $orderBy = $filtros['order_by'] ?? 'created_at';
            $direction = $filtros['direction'] ?? 'desc';
            $query->orderBy($orderBy, $direction);

            return $query->paginate($perPage);

        } catch (\Exception $e) {
            Log::error('Erro ao listar tarefas: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Criar nova tarefa
     */
    public function criarTarefa(array $dados): Tarefa
    {
        try {
            DB::beginTransaction();

            $tarefa = Tarefa::create($dados);

            DB::commit();

            Log::info('Tarefa criada com sucesso', ['id' => $tarefa->id]);

            return $tarefa;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar tarefa: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Atualizar tarefa existente
     */
    public function atualizarTarefa(int $id, array $dados): Tarefa
    {
        try {
            DB::beginTransaction();

            $tarefa = Tarefa::findOrFail($id);
            $tarefa->update($dados);

            DB::commit();

            Log::info('Tarefa atualizada com sucesso', ['id' => $id]);

            return $tarefa->fresh();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao atualizar tarefa: ' . $e->getMessage(), ['id' => $id]);
            throw $e;
        }
    }

    /**
     * Deletar tarefa
     */
    public function deletarTarefa(int $id): bool
    {
        try {
            DB::beginTransaction();

            $tarefa = Tarefa::findOrFail($id);
            $deleted = $tarefa->delete();

            DB::commit();

            if ($deleted) {
                Log::info('Tarefa deletada com sucesso', ['id' => $id]);
            }

            return $deleted;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao deletar tarefa: ' . $e->getMessage(), ['id' => $id]);
            throw $e;
        }
    }

    /**
     * Alternar status de conclusão
     */
    public function alternarStatus(int $id): Tarefa
    {
        try {
            DB::beginTransaction();

            $tarefa = Tarefa::findOrFail($id);
            $tarefa->update(['completed' => !$tarefa->completed]);

            DB::commit();

            Log::info('Status da tarefa alterado', [
                'id' => $id, 
                'novo_status' => $tarefa->completed ? 'concluída' : 'pendente'
            ]);

            return $tarefa->fresh();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao alternar status da tarefa: ' . $e->getMessage(), ['id' => $id]);
            throw $e;
        }
    }

    /**
     * Obter estatísticas das tarefas
     */
    public function obterEstatisticas(): array
    {
        try {
            $total = Tarefa::count();
            $concluidas = Tarefa::where('completed', true)->count();
            $pendentes = Tarefa::where('completed', false)->count();
            $atrasadas = Tarefa::where('completed', false)
                              ->whereNotNull('due_date')
                              ->where('due_date', '<', now())
                              ->count();

            return [
                'total' => $total,
                'concluidas' => $concluidas,
                'pendentes' => $pendentes,
                'atrasadas' => $atrasadas,
                'percentual_concluido' => $total > 0 ? round(($concluidas / $total) * 100, 2) : 0
            ];

        } catch (\Exception $e) {
            Log::error('Erro ao obter estatísticas: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Buscar tarefas por texto
     */
    public function buscarTarefas(string $termo): Collection
    {
        try {
            return Tarefa::where('title', 'like', '%' . $termo . '%')
                        ->orWhere('description', 'like', '%' . $termo . '%')
                        ->orderBy('priority', 'desc')
                        ->orderBy('created_at', 'desc')
                        ->get();

        } catch (\Exception $e) {
            Log::error('Erro ao buscar tarefas: ' . $e->getMessage());
            throw $e;
        }
    }
}
