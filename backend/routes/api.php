<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TarefaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rota de teste da API
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando corretamente',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Rotas para tarefas
Route::prefix('tarefas')->group(function () {
    Route::get('/', [TarefaController::class, 'index']);
    Route::get('/{id}', [TarefaController::class, 'show']);
    Route::post('/', [TarefaController::class, 'store']);
    Route::put('/{id}', [TarefaController::class, 'update']);
    Route::patch('/{id}', [TarefaController::class, 'update']);
    Route::delete('/{id}', [TarefaController::class, 'destroy']);
    Route::patch('/{id}/toggle', [TarefaController::class, 'toggleComplete']);
});

// Rota para estatísticas
Route::get('/estatisticas', function () {
    $service = app(\App\Services\TarefaService::class);
    return response()->json([
        'success' => true,
        'data' => $service->obterEstatisticas()
    ]);
});

// Rota para busca
Route::get('/buscar/{termo}', function (string $termo) {
    $service = app(\App\Services\TarefaService::class);
    $tarefas = $service->buscarTarefas($termo);
    
    return response()->json([
        'success' => true,
        'data' => $tarefas
    ]);
});

// Rota para usuário autenticado (se implementar autenticação)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
