import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, LogOut, User, CreditCard, Bell, Shield, Loader2, AlertCircle, Settings as SettingsIcon, Key, Eye, EyeOff, Mail, Rocket, Camera, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";

const passwordSchema = z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" });
const emailSchema = z.string().email({ message: "Email inválido" });

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [showCurrentPasswordForEmail, setShowCurrentPasswordForEmail] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkSubscription = async (accessToken: string) => {
      try {
        const { data, error } = await supabase.functions.invoke("check-subscription", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!isMounted) return;

        if (error) {
          console.error("Erro ao verificar assinatura:", error);
        } else {
          setHasSubscription(data?.hasSubscription || false);
          setSubscriptionEnd(data?.subscriptionEnd || null);
        }
      } catch (error) {
        console.error("Erro ao verificar assinatura:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session?.user) {
          navigate("/auth");
          return;
        }
        setUser(session.user);
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
        setDisplayName(session.user.user_metadata?.full_name || "");
        await checkSubscription(session.access_token);
      } catch (error) {
        console.error("Erro ao iniciar auth:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      // Defer to avoid deadlock
      setTimeout(() => {
        if (isMounted) checkSubscription(session.access_token);
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sessão não encontrada");

      const { data, error } = await supabase.functions.invoke("cancel-subscription", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Assinatura cancelada com sucesso!");
        setHasSubscription(false);
        setSubscriptionEnd(null);
      } else {
        throw new Error(data?.error || "Erro ao cancelar assinatura");
      }
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar assinatura");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      passwordSchema.parse(newPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!currentPassword) {
      toast.error("Digite sua senha atual");
      return;
    }

    setIsChangingPassword(true);
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Senha atual incorreta");
        return;
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      if (error.message?.includes("same_password")) {
        toast.error("A nova senha não pode ser igual à anterior");
      } else {
        toast.error("Erro ao alterar senha. Tente novamente.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(newEmail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (newEmail === user?.email) {
      toast.error("O novo email não pode ser igual ao atual");
      return;
    }

    if (!currentPasswordForEmail) {
      toast.error("Digite sua senha atual");
      return;
    }

    setIsChangingEmail(true);
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: currentPasswordForEmail,
      });

      if (signInError) {
        toast.error("Senha atual incorreta");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast.success("Um link de confirmação foi enviado para o novo email!");
      setNewEmail("");
      setCurrentPasswordForEmail("");
      setShowEmailForm(false);
    } catch (error: any) {
      console.error("Erro ao alterar email:", error);
      if (error.message?.includes("email_exists")) {
        toast.error("Este email já está em uso");
      } else {
        toast.error("Erro ao alterar email. Tente novamente.");
      }
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleSaveDisplayName = async () => {
    const trimmed = displayName.trim();
    if (trimmed.length > 100) {
      toast.error("O nome deve ter no máximo 100 caracteres");
      return;
    }

    setIsSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });

      if (error) throw error;

      toast.success("Nome atualizado com sucesso!");
      setIsEditingName(false);
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      toast.error("Erro ao atualizar nome. Tente novamente.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Remove old avatar if exists
      await supabase.storage.from("avatars").remove([filePath]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Add cache-busting param
      const urlWithCache = `${publicUrl}?t=${Date.now()}`;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlWithCache },
      });

      if (updateError) throw updateError;

      setAvatarUrl(urlWithCache);
      toast.success("Foto de perfil atualizada!");
    } catch (error: any) {
      console.error("Erro ao enviar foto:", error);
      toast.error("Erro ao enviar foto. Tente novamente.");
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    if (!user) return;
    setIsUploadingAvatar(true);
    try {
      // List and remove all files in user folder
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(user.id);

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${user.id}/${f.name}`);
        await supabase.storage.from("avatars").remove(filePaths);
      }

      // Clear avatar from user metadata
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });

      if (error) throw error;

      setAvatarUrl(null);
      toast.success("Foto de perfil removida!");
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      toast.error("Erro ao remover foto.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">Configurações</span>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 max-w-3xl mx-auto space-y-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Perfil</CardTitle>
                <CardDescription>Informações da sua conta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 pb-2">
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted border-4 border-primary/10 flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {avatarUrl ? "Clique no ícone para trocar" : "Adicione uma foto de perfil"}
                </p>
                {avatarUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-7 px-2"
                    onClick={handleAvatarRemove}
                    disabled={isUploadingAvatar}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remover
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome de exibição</label>
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome"
                    maxLength={100}
                    disabled={isSavingName}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveDisplayName();
                      if (e.key === "Escape") {
                        setDisplayName(user?.user_metadata?.full_name || "");
                        setIsEditingName(false);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveDisplayName}
                    disabled={isSavingName}
                  >
                    {isSavingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDisplayName(user?.user_metadata?.full_name || "");
                      setIsEditingName(false);
                    }}
                    disabled={isSavingName}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user?.user_metadata?.full_name || "Não informado"}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditingName(true)}
                  >
                    Editar
                  </Button>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Conta criada em</label>
              <p className="text-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "—"}
              </p>
            </div>

            <Separator />

            {/* Alterar Email */}
            {!showEmailForm ? (
              <Button variant="outline" className="w-full" onClick={() => setShowEmailForm(true)}>
                <Mail className="w-4 h-4 mr-2" />
                Alterar Email
              </Button>
            ) : (
              <form onSubmit={handleChangeEmail} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPasswordForEmail" className="text-sm font-medium">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPasswordForEmail"
                      type={showCurrentPasswordForEmail ? "text" : "password"}
                      placeholder="••••••••"
                      value={currentPasswordForEmail}
                      onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                      disabled={isChangingEmail}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCurrentPasswordForEmail(!showCurrentPasswordForEmail)}
                    >
                      {showCurrentPasswordForEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newEmail" className="text-sm font-medium">
                    Novo Email
                  </label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="novoemail@exemplo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={isChangingEmail}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Você receberá um link de confirmação no novo email.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowEmailForm(false);
                      setNewEmail("");
                      setCurrentPasswordForEmail("");
                    }}
                    disabled={isChangingEmail}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isChangingEmail}>
                    {isChangingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Confirmação"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Acessar Aplicativo */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Acessar Aplicativo</CardTitle>
                <CardDescription>Entre no app e comece a estudar</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/app">
                <Rocket className="w-4 h-4 mr-2" />
                Comece a Estudar
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Assinatura */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Assinatura</CardTitle>
                <CardDescription>Gerencie seu plano</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${hasSubscription ? "bg-green-500" : "bg-muted-foreground"}`} />
                  <p className={hasSubscription ? "text-green-600 font-medium" : "text-muted-foreground"}>
                    {hasSubscription ? "Ativo" : "Inativo"}
                  </p>
                </div>
              </div>
              
              {!hasSubscription && (
                <Button asChild>
                  <Link to="/pricing">Assinar Agora</Link>
                </Button>
              )}
            </div>

            {subscriptionEnd && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Próxima cobrança</label>
                <p className="text-foreground">
                  {new Date(subscriptionEnd).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}

            {hasSubscription && (
              <>
                <Separator />
                <div className="pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={isCanceling}>
                        {isCanceling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelando...
                          </>
                        ) : (
                          "Cancelar Assinatura"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          Cancelar Assinatura
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja cancelar sua assinatura? Você perderá acesso a todos os recursos premium imediatamente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Sim, cancelar assinatura
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Alterar Senha</CardTitle>
                <CardDescription>Atualize sua senha de acesso</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPasswordForm ? (
              <Button variant="outline" className="w-full" onClick={() => setShowPasswordForm(true)}>
                <Key className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isChangingPassword}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isChangingPassword}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    disabled={isChangingPassword}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Nova Senha"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Notificações</CardTitle>
                <CardDescription>Preferências de comunicação</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              As notificações serão enviadas para o email cadastrado.
            </p>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Segurança</CardTitle>
                <CardDescription>Configurações de segurança da conta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;