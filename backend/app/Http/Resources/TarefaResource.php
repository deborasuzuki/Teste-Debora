<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TarefaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'completed' => $this->completed,
            'priority' => $this->priority,
            'due_date' => $this->due_date?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'status_text' => $this->completed ? 'Concluída' : 'Pendente',
            'priority_text' => $this->getPriorityText(),
            'is_overdue' => $this->isOverdue(),
        ];
    }

    /**
     * Obter texto da prioridade
     */
    private function getPriorityText(): string
    {
        return match($this->priority) {
            1 => 'Baixa',
            2 => 'Média-Baixa',
            3 => 'Média',
            4 => 'Média-Alta',
            5 => 'Alta',
            default => 'Não definida'
        };
    }

    /**
     * Verificar se a tarefa está atrasada
     */
    private function isOverdue(): bool
    {
        if (!$this->due_date || $this->completed) {
            return false;
        }

        return $this->due_date->isPast();
    }
}
