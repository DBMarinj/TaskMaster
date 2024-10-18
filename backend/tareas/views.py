from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Tarea, Etiqueta, Prioridad, Estado
from .serializers import TareaSerializer, EtiquetaSerializer, PrioridadSerializer, EstadoSerializer

# ViewSet para Tarea
class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        # Guarda el usuario actual como el usuario asociado a la tarea
        serializer.save(usuario=self.request.user)

# ViewSet para Etiqueta
class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

# ViewSet para Prioridad
class PrioridadViewSet(viewsets.ModelViewSet):
    queryset = Prioridad.objects.all()
    serializer_class = PrioridadSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

# ViewSet para Estado
class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

