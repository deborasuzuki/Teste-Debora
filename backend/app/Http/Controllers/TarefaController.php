<?php

namespace App\Http\Controllers;

use App\Models\Tarefa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TarefaController extends Controller
{
    /**
     * Listar todas as tarefas com filtros opcionais
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Tarefa::query();

            // Filtros
            if ($request->has('completed')) {
                $query->where('completed', $request->boolean('completed'));
            }

            if ($request->has('priority')) {
                $query->where('priority', $request->integer('priority'));
            }

            if ($request->has('search')) {
                $query->where('title', 'like', '%' . $request->string('search') . '%');
            }

            // Ordenação
            $orderBy = $request->get('order_by', 'created_at');
            $direction = $request->get('direction', 'desc');
            $query->orderBy($orderBy, $direction);

            $tarefas = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $tarefas->items(),
                'pagination' => [
                    'current_page' => $tarefas->currentPage(),
                    'last_page' => $tarefas->lastPage(),
                    'per_page' => $tarefas->perPage(),
                    'total' => $tarefas->total()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar tarefas',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mostrar uma tarefa específica
     */
    public function show(int $id): JsonResponse
    {
        try {
            $tarefa = Tarefa::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $tarefa
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarefa não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar tarefa',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Criar uma nova tarefa
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'priority' => 'nullable|integer|min:1|max:5',
                'due_date' => 'nullable|date|after:now'
            ]);

            $tarefa = Tarefa::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tarefa criada com sucesso',
                'data' => $tarefa
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar tarefa',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Atualizar uma tarefa existente
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $tarefa = Tarefa::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'completed' => 'sometimes|boolean',
                'priority' => 'sometimes|integer|min:1|max:5',
                'due_date' => 'nullable|date'
            ]);

            $tarefa->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tarefa atualizada com sucesso',
                'data' => $tarefa->fresh()
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarefa não encontrada'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar tarefa',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Deletar uma tarefa
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $tarefa = Tarefa::findOrFail($id);
            $tarefa->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tarefa deletada com sucesso'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarefa não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar tarefa',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Marcar tarefa como concluída
     */
    public function toggleComplete(int $id): JsonResponse
    {
        try {
            $tarefa = Tarefa::findOrFail($id);
            $tarefa->update(['completed' => !$tarefa->completed]);

            return response()->json([
                'success' => true,
                'message' => 'Status da tarefa alterado com sucesso',
                'data' => $tarefa->fresh()
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarefa não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao alterar status da tarefa',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
